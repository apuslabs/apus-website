import { EthereumSigner, createData } from '@dha-team/arbundles'
import { connect } from '@permaweb/aoconnect'
import fs from 'fs'
import { ethers } from 'ethers';

//const key = fs.readFileSync("./pkey", "utf-8").replace("\n", "")
const key = "53d18212bd84bff549749817484f97b9b30716317dc92de696db250bc75c412d"
// for testing
const MOCK_AO_MINT = "_FR1s7hAtVFABnglODISvn4ZPP76aXbj2N3zwlH70zU"

// 创建钱包对象
const wallet = new ethers.Wallet(key);

// 获取地址
const address = wallet.address;

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export async function sendMessage(msg) {
  function createDataItemSigner(wallet) {
    const signer = async ({ data, tags, target, anchor }) => {
      const signer = new EthereumSigner(wallet)
      const dataItem = createData(data, signer, { tags, target, anchor })
      return dataItem.sign(signer)
        .then(async () => ({
          id: await dataItem.id,
          raw: await dataItem.getRaw()
        }))
    }

    return signer
  }

  const signer = createDataItemSigner(key)
  const message = await connect().message({
    process: MOCK_AO_MINT,
    signer,
    data: msg.Data || Date.now().toString(),
    tags: msg.Tags
  })
  return await connect().result({ process: MOCK_AO_MINT, message })
}

export async function testIncreaseStaking() {
  try {
    const result = await sendMessage({
      Tags: [
        { name: 'Action', value: 'User.Increase-Staking' },
        { name: "_n", value: generateRandomString(32) },
      ],
      Data: JSON.stringify(
        {
          ar_address: "ELFJ7nWC25t-vCh14xaMTF_Zkuu_FT1hRVUnfdsafsa",
          increased_amount: "50000",
          current_amount: "50000"
        }
      )
    });

    console.log(result.Error)
    console.log('Result:', result);  // Log the result object to check its structure

    if (result && result.Messages && Array.isArray(result.Messages) && result.Messages.length > 0) {
      console.log(result.Messages[0].Data);  // Safely access the Data property
    } else {
      console.error('Error: No messages received or the structure of result.Messages is invalid.');
    }
  } catch (error) {
    console.error('Error:', error);
  }

}


export async function testDecreaseStaking() {
  try {
    const result = await sendMessage({
      Tags: [
        { name: 'Action', value: 'User.Decrease-Staking' },
        { name: "_n", value: generateRandomString(32) },
      ],
      Data: JSON.stringify(
        {
          decreased_amount: "30000",
          current_amount: "20000"
        }
      )
    });

    console.log(result.Error)
    console.log('Result:', result);  // Log the result object to check its structure

    if (result && result.Messages && Array.isArray(result.Messages) && result.Messages.length > 0) {
      console.log(result.Messages[0].Data);  // Safely access the Data property
    } else {
      console.error('Error: No messages received or the structure of result.Messages is invalid.');
    }
  } catch (error) {
    console.error('Error:', error);
  }

}

export async function testGetAllocation() {
  try {
    const result = await sendMessage({
      Tags: [
        { name: 'Action', value: 'User.Get-Allocations' },
        { name: "_n", value: generateRandomString(32) },
      ]
    });

    console.log(result.Error)
    console.log('Result:', result);  // Log the result object to check its structure

    if (result && result.Messages && Array.isArray(result.Messages) && result.Messages.length > 0) {
      console.log(result.Messages[0].Data);  // Safely access the Data property
    } else {
      console.error('Error: No messages received or the structure of result.Messages is invalid.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
// testDeposit(20000)
// getTokens()
// getAllocationTable()
// testIncreaseStaking()
// testGetAllocation()
testDecreaseStaking()