/* global agent, app */
'use strict';

const database = require('../helpers/database');
const assert = require('proclaim');

describe('GET /v1/repos/:repoId', () => {
	let request;

	beforeEach(async () => {
		await database.seed(app, 'basic');
		request = agent
			.get('/v1/repos/c990cb4b-c82b-5071-afb0-16149debc53d')
			.set('X-Api-Key', 'mock-read-key')
			.set('X-Api-Secret', 'mock-read-secret');
	});

	it('responds with a 200 status', () => {
		return request.expect(200);
	});

	it('responds with JSON', () => {
		return request.expect('Content-Type', /application\/json/);
	});

	describe('JSON response', () => {
		let response;

		beforeEach(async () => {
			response = (await request.then()).body;
		});

		it('has a `repo` object property', () => {
			assert.isObject(response.repo);
		});

		it('includes the latest version for the requested repository', () => {

			assert.isObject(response.repo);
			assert.strictEqual(response.repo.id, 'c990cb4b-c82b-5071-afb0-16149debc53d');
			assert.strictEqual(response.repo.name, 'o-mock-component');

		});

	});

	describe('when :repoId is not a valid repo ID', () => {
		let request;

		beforeEach(async () => {
			await database.seed(app, 'basic');
			request = agent
				.get('/v1/repos/not-an-id')
				.set('X-Api-Key', 'mock-read-key')
				.set('X-Api-Secret', 'mock-read-secret');
		});

		it('responds with a 404 status', () => {
			return request.expect(404);
		});

		it('responds with HTML', () => {
			return request.expect('Content-Type', /text\/html/);
		});

	});

	describe('when no API credentials are provided', () => {
		let request;

		beforeEach(async () => {
			await database.seed(app, 'basic');
			request = agent.get('/v1/repos/c990cb4b-c82b-5071-afb0-16149debc53d');
		});

		it('responds with a 401 status', () => {
			return request.expect(401);
		});

		it('responds with HTML', () => {
			return request.expect('Content-Type', /text\/html/);
		});

	});

	describe('when the provided API key does not have the required permissions', () => {
		let request;

		beforeEach(async () => {
			await database.seed(app, 'basic');
			request = agent
				.get('/v1/repos/c990cb4b-c82b-5071-afb0-16149debc53d')
				.set('X-Api-Key', 'mock-no-key')
				.set('X-Api-Secret', 'mock-no-secret');
		});

		it('responds with a 403 status', () => {
			return request.expect(403);
		});

		it('responds with HTML', () => {
			return request.expect('Content-Type', /text\/html/);
		});

	});

});