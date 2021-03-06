/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './lib/IocContainer';
import { UsersController } from './controllers/UsersController';
import { TestController } from './controllers/TestController';

const models: TsoaRoute.Models = {
    "Name": {
        "properties": {
            "first": { "dataType": "string", "required": true },
            "last": { "dataType": "string" },
        },
    },
    "User": {
        "properties": {
            "id": { "dataType": "double", "required": true },
            "email": { "dataType": "string", "required": true },
            "name": { "ref": "Name", "required": true },
            "status": { "dataType": "enum", "enums": ["Happy", "Sad"] },
            "phoneNumbers": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "UserCreationRequest": {
        "properties": {
            "email": { "dataType": "string", "required": true },
            "name": { "ref": "Name", "required": true },
            "phoneNumbers": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "Test": {
        "properties": {
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
        },
    },
    "TestCreationRequest": {
        "properties": {
            "name": { "dataType": "string", "required": true },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.get('/api/v1/users/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UsersController>(UsersController);


            const promise = controller.getUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/v1/users',
        function(request: any, response: any, next: any) {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserCreationRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UsersController>(UsersController);


            const promise = controller.createUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/v1/test/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<TestController>(TestController);


            const promise = controller.getTest.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/v1/test',
        function(request: any, response: any, next: any) {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "TestCreationRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<TestController>(TestController);


            const promise = controller.createTest.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });


    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data) {
                    response.status(statusCode | 200).json(data);
                } else {
                    response.status(statusCode | 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
