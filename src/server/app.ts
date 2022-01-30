'use strict'
import * as dotenv from 'dotenv'
import { server } from './server'
import { runDevServer, SERVER_LIST } from "./../scripts/dev-server"

dotenv.config()
server()
