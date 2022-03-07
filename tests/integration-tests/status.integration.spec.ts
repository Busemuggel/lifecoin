import 'jest'
import * as express from 'express'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import IntegrationHelpers from './../helpers/Integration-helpers'

describe('status integration tests', () => {
  let app: express.Application

  beforeAll(async() => {
   // app = await IntegrationHelpers.getApp()
  })

  test('Verify Jest is working', () => {
    expect(true).toBeTruthy()
  })
})
