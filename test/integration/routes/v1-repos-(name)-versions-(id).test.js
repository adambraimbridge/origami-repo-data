/* global agent, app */
'use strict';

const database = require('../helpers/database');

describe('GET /v1/repos/:repoName', () => {
	let request;

	beforeEach(async () => {
		await database.seed(app, 'basic');
		request = agent.get('/v1/repos/o-mock-component/versions/5bdc1cb5-19f1-4afe-883b-83c822fbbde0');
	});

	it('responds with a 307 status', () => {
		return request.expect(307);
	});

	it('responds with a Location header pointing to the ID-based endpoint', () => {
		return request.expect('Location', '/v1/repos/c990cb4b-c82b-5071-afb0-16149debc53d/versions/5bdc1cb5-19f1-4afe-883b-83c822fbbde0');
	});

	it('responds with text', () => {
		return request.expect('Content-Type', /text\/plain/);
	});

});
