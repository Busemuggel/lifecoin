# lifecoin

npm install -g ts-node
npm install --global kill-port

kill-port 3000 3001 3002 3003 5000 5001 5002 5003


#### POST /transact
Send transactions

##### Body `json`
```json
{
    "to":"Address",
    "amount":Number,
    "type": "TRANSACTION" | "STAKE" | "VALIDATOR_FEE"
}
```

#### GET /transactions
Returns the content of the transaction pool

#### GET /public-key
Returns the public-key of the node

#### GET /balance
Returns the balance of the node

### ICO

Add prefix `/ico` before Nodes APIs for ICO's APIs

## Start system

1. Run a few nodes with different HTTP and Socket Ports. Initial they all have zero balance exept the ICO Node.
    
    ```
    npm start
    ```  

2. Open Postman and call `localhost://3000/ico/transact` with the following in the body. Note intial balance of ICO is 1000. You can change that in config.js. Get the address of the all the nodes by calling
   ```json
   {
	"to":"3ec620c7799e4ce381eb7fa0b38d2c92b2ce204fe4d3e62b7e9ce2facda7b151",
	"amount":100,
	"type":"TRANSACTION"
   }
   ```

3. Do this 3 times, since 3 is set as the threshold for the transaction pool and can be changed in `config.ts`. It is only when this threshold is hit, a block is generated.
4. Once the block is generated, check the balance of those nodes that you have sent coins too. They would get some less amount because the transaction fee is set to 1 coin in `config.ts`.
