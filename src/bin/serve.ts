#!/usr/bin/env node
import 'reflect-metadata';
import { App } from '../main';

const app = new App();

app.start()
    .catch(err => {
        app.logger.error('Failed to start', err);
        process.exit(1);
    });
