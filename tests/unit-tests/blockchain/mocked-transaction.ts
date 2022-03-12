import { TRANSACTION_TYPE } from "../../../src/config"

export const mockedTransactionOne = {
  "id": "62af2780-9e6e-11ec-89da-89e1f3a3718a",
  "type": TRANSACTION_TYPE.Transaction,
  "input": {
    "timestamp": 1646695748088,
    "from": "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
    "signature": "3AFD5C1A32B3444BAA9ED3B26E923C3F0359FB6FB6B8BA65183C4C683EF0E6057FE880105F8F6EB3ADE7883FD271399E5B33EEC7A1DE6C166DFC3D534A594707"
  },
  "output": {
    "to": "b6902c1713cc9ef50316b3a9c3aba668581fee74fa4dbc82f3e8786e46855b11",
    "amount": 149,
    "fee": 1
  }
}

export const mockedTransactionTwo = {
  "id": "62af2780-9e6e-11ec-89da-89e1f3a3718a",
  "type": TRANSACTION_TYPE.Transaction,
  "input": {
    "timestamp": 1646695748088,
    "from": "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
    "signature": "3AFD5C1A32B3444BAA9ED3B26E923C3F0359FB6FB6B8BA65183C4C683EF0E6057FE880105F8F6EB3ADE7883FD271399E5B33EEC7A1DE6C166DFC3D534A594707"
  },
  "output": {
    "to": "b6902c1713cc9ef50316b3a9c3aba668581fee74fa4dbc82f3e8786e46855b11",
    "amount": 149,
    "fee": 1
  }
}

export const mockedTransactionValidatorFee = {
  "id": "f348fa00-9e6e-11ec-8fae-9d04524d3462",
  "type": TRANSACTION_TYPE.Validator_fee,
  "input": {
    "timestamp": 1646695990688,
    "from": "537d981836c881477816ded2179bd9da1985e0fe27909f068d7baec3e45a838e",
    "signature": "6B2D126EF4D3DDC48A0ED74E778237DB65FDF6A57CAE4137D21B2F0AA7FC091B3F74C09EE34F93C86BF873845A5129F9887338B1A9573C0F97EF7C682F09E70D"
  },
  "output": {
    "to": "0",
    "amount": 29,
    "fee": 1
  }
}

export const brokenMockedTransactionValidatorFee = {
  "id": "f348fa00-9e6e-11ec-8fae-9d04524d3462",
  "type": TRANSACTION_TYPE.Validator_fee,
  "input": {
    "timestamp": 1646695990688,
    "from": "111d981836c881477816ded2179bd9da1985e0fe27909f068d7baec3e45a728",
    "signature": "6B2D126EF4D3DDC48A0ED74E778237DB65FDF6A57CAE4137D21B2F0AA7FC091B3F74C09EE34F93C86BF873845A5129F9887338B1A9573C0F97EF7C682F09E70D"
  },
  "output": {
    "to": "0",
    "amount": 22,
    "fee": 1
  }
}

export const mockedTransactionStake = {
  "id": "320af4a0-9e6f-11ec-8fae-9d04524d3462",
  "type": TRANSACTION_TYPE.Stake,
  "input": {
    "timestamp": 1646696095978,
    "from": "537d981836c881477816ded2179bd9da1985e0fe27909f068d7baec3e45a838e",
    "signature": "6B2D126EF4D3DDC48A0ED74E778237DB65FDF6A57CAE4137D21B2F0AA7FC091B3F74C09EE34F93C86BF873845A5129F9887338B1A9573C0F97EF7C682F09E70D"
  },
  "output": {
    "to": "0",
    "amount": 29,
    "fee": 1
  }
}