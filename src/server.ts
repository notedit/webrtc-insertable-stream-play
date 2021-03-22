import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import http from 'http'
import cors from 'cors'
import methodOverride = require('method-override')

import { EventEmitter } from 'events'

import apiRouter from './api'
import config from './config'


export default class Server extends EventEmitter {

    private app: express.Application
    private httpServer: http.Server

    
    constructor() {
        //create expressjs application
        super()

        this.app = express()

        //configure application
        this.config()
        
        //add routes
        this.routes()
    }

    public listen(port:number, hostname:string, callback?:(...args: any[]) => void) {

        this.httpServer = this.app.listen(port, hostname, callback)
    }

    private config() {

        //add static paths
        this.app.use(express.static('public'))

        this.app.use(cors())

        // for real ip
        this.app.set('trust proxy', true)

        //mount json form parser
        this.app.use(bodyParser.json())

        //mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true
        }))

        //mount override?
        this.app.use(methodOverride())

        //catch 404 and forward to error handler
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404
            next(err)
        })
    }

    private routes() {
        //use router middleware
        this.app.use(apiRouter)
    }

}