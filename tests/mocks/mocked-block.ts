import { TRANSACTION_TYPE } from "../config"
import Block from "../blockchain/block"

export const mockedBlock: Block = {
  "timestamp": 1646668608462,
  "lastHash": "genesis-hash",
  "hash": "aa7faa7a7479a77429db8740595c0e60b6fdd8d69bd268809d708d0e1fe5cd19",
  "data": [
    {
      "id": "31190ea0-9e2f-11ec-b5a1-b1aed34f9adc",
      "type": TRANSACTION_TYPE.Transaction,
      "input": {
        "timestamp": 1646668606602,
        "from": "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
        "signature": "3AFD5C1A32B3444BAA9ED3B26E923C3F0359FB6FB6B8BA65183C4C683EF0E6057FE880105F8F6EB3ADE7883FD271399E5B33EEC7A1DE6C166DFC3D534A594707"
      },
      "output": {
        "to": "b6902c1713cc9ef50316b3a9c3aba668581fee74fa4dbc82f3e8786e46855b11",
        "amount": 149,
        "fee": 1
      }
    },
    {
      "id": "319b36f0-9e2f-11ec-b5a1-b1aed34f9adc",
      "type": TRANSACTION_TYPE.Transaction,
      "input": {
        "timestamp": 1646668607456,
        "from": "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
        "signature": "3AFD5C1A32B3444BAA9ED3B26E923C3F0359FB6FB6B8BA65183C4C683EF0E6057FE880105F8F6EB3ADE7883FD271399E5B33EEC7A1DE6C166DFC3D534A594707"
      },
      "output": {
        "to": "b6902c1713cc9ef50316b3a9c3aba668581fee74fa4dbc82f3e8786e46855b11",
        "amount": 149,
        "fee": 1
      }
    },
    {
      "id": "321792e0-9e2f-11ec-b5a1-b1aed34f9adc",
      "type": TRANSACTION_TYPE.Transaction,
      "input": {
        "timestamp": 1646668608270,
        "from": "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
        "signature": "3AFD5C1A32B3444BAA9ED3B26E923C3F0359FB6FB6B8BA65183C4C683EF0E6057FE880105F8F6EB3ADE7883FD271399E5B33EEC7A1DE6C166DFC3D534A594707"
      },
      "output": {
        "to": "b6902c1713cc9ef50316b3a9c3aba668581fee74fa4dbc82f3e8786e46855b11",
        "amount": 149,
        "fee": 1
      }
    }
  ],
  "validator": "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
  "signature": "88B71F6D15D0B7E6EF47B970755B50D485643D180680CD930B965EA98F505F44253A373FB7885F10801481C055CFCE5D519A258450A81E8C397445C76492240A"
}
