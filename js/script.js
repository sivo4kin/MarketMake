
var vm = new Vue({
    el: '#app',
    data: {
      buttonEth: '...',
      buttonBsc: '...',
      accountEth: '',
      accountBsc: '',
      //Exchange tab
      ethChainId: '',
      bscChainId: '',
      tokenFrom: '',
      tokenTo: '',
      amountFrom: '',
      amountTo: '',
      accountFrom: '',
      accountTo: '',
      chains: [{id:0x4, name:"Ethereum rinkeby", icon:"ethereum.png", web:"web3eth"}, {id:0x61, name:"BSC testnet", icon:"bsc.webp",web:"web3bsc"}],
      chainFrom: '',
      chainTo: '',
      tokensEth: [{symbol:"DAI",addr:"0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",icon:"dai.webp",price:1}], //price bypass{symbol:"USDT",addr:"",icon:"tether.webp",price:1} {symbol:"USDC",addr:"0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",icon:"usdc.webp",price:1}
      tokensBsc: [{symbol:"DAI",addr:"0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867",icon:"dai.webp",price:1},{symbol:"dLINK",addr:"0x88e69c0d2d924e642965f8dd151dd2e24ba154f8",icon:"dlink.webp",price:0.1}],//{symbol:"USDC",addr:"0x64544969ed7ebf5f083679233325356ebe738930",icon:"usdc.webp",price:1}
      itemsFrom:{},
      itemsTo:{},
      //Liquidity tab
      amountLiqEth:'',
      amountLiqBsc:'',
      tokenLiqEth:'',
      tokenLiqBsc:'',
      price: 1,
      //balances
      balanceFrom:'-',
      balanceTo:'-',
      balanceLiqEth:'-',
      balanceLiqBsc:'-',

    },
    watch: {
      
      amountFrom: function() {
        if (document.activeElement.id == 'num1' ) {
        calcAmount('from')
        }
      }, 
     
      amountTo: function() {
        if (document.activeElement.id == 'num2' ) {
        calcAmount('to')
        }
      },
      
      tokenFrom: function() {
        calcPrice('to'); 
        
        
      },
      tokenTo: function() {
        
        calcPrice('from');
        
      },

      buttonEth: function() {
        if (this.buttonEth.substr(0,2) == '0x') {
          document.getElementById("pulse2").classList.add("shadow");
        } else {
          document.getElementById("pulse2").classList.remove("shadow");
        }
      },

      buttonBsc: function() {
        if (this.buttonBsc.substr(0,2) == '0x') {
          document.getElementById("pulse1").classList.add("shadow");
        } else {
          document.getElementById("pulse1").classList.remove("shadow");
        }
      },

    } 
  })

//set default params
  //for exchange
  vm.tokenFrom = vm.tokensEth[0];
  vm.tokenTo = vm.tokensBsc[0];
  vm.itemsFrom = vm.tokensEth;
  vm.itemsTo = vm.tokensBsc;
  vm.chainFrom = vm.chains[0];
  vm.chainTo = vm.chains[1];
 
  //for liquidity
  vm.tokenLiqEth = vm.tokensEth[0];
  vm.tokenLiqBsc = vm.tokensBsc[0];

  function calcPrice(ft) {
    vm.price = vm.tokenFrom.price/vm.tokenTo.price; 
    calcAmount(ft);
  }

  function calcAmount(ft) {
     if (ft == 'from' && (vm.amountFrom === '' || vm.amountFrom == 0 ) ) {vm.amountTo = ''; return} 
     if (ft == 'to' && (vm.amountTo === '' || vm.amountTo == 0) ) {vm.amountFrom = ''; return}
     
     if (ft == 'from') { vm.amountTo = BigNumber(vm.amountFrom).times(vm.price); } else { vm.amountFrom = BigNumber(vm.amountTo).div(vm.price)} ;

  }
 


  //input only number
  function isNumberKey(evt,id,ft)
  {
    var data = document.getElementById(id).value;
    if((evt.charCode>= 48 && evt.charCode <= 57) || evt.charCode== 46 ||evt.charCode == 0){
    if(data.indexOf('.') > -1 || data == ''){
     if(evt.charCode== 46)
      evt.preventDefault();
    }
    }else evt.preventDefault();
  }  

setTimeout(checkInstall, 500);

var delta =360;
  function rotate360Deg(ele){
      ele.style.webkitTransform="rotate("+delta+"deg)";
      delta+=360;
      //rotate data
      let chain,balance,amount,token,items;
      chain = vm.chainTo; vm.chainTo = vm.chainFrom; vm.chainFrom = chain;
      balance = vm.balanceTo; vm.balanceTo = vm.balanceFrom; vm.balanceFrom = balance;
      items = vm.itemsTo; vm.itemsTo = vm.itemsFrom; vm.itemsFrom = items;
      token = vm.tokenTo; vm.tokenTo = vm.tokenFrom; vm.tokenFrom = token;
      amount = vm.amountTo; vm.amountTo = vm.amountFrom; vm.amountFrom = amount;
      account = vm.accountTo; vm.accountTo = vm.accountFrom; vm.accountFrom = account;

  }

function setTokenFrom(item) {
  vm.tokenFrom = item;
  (vm.chainFrom.id == '0x61') ? refreshAccountDataBsc() : refreshAccountDataEth()
  //getBalanceFrom()
}

function setTokenTo(item) {
  vm.tokenTo = item;
  (vm.chainTo.id == '0x61') ? refreshAccountDataBsc() : refreshAccountDataEth()
  //getBalanceFrom()
}

function setLiqToken(item, typ) {
  if (typ == 'eth') {vm.tokenLiqEth = item; fetchLiquidityDataEth()}
  else {vm.tokenLiqBsc = item; fetchLiquidityDataBsc()}
  
  //getBalanceFrom()
}


async function checkInstall() {
    if (window.ethereum) { 
        window.web3eth = new Web3(ethereum);
        vm.buttonEth = "Connect to Metamask";
    } else {vm.buttonEth = "Install Metamask"}

    if (window.BinanceChain) {
        window.web3bsc = new Web3(BinanceChain); 
        vm.buttonBsc = "Connect to Binance wallet";
    } else {vm.buttonBsc = "Install Binance wallet"}

}

//Ethereum wallet

async function connectEth() {
  if (vm.buttonEth == "Install Metamask") {window.open("https://metamask.io/download.html"); return}
 await ethereum.enable();
 vm.ethChainId = await web3eth.eth.getChainId();
 const accountsEth = await web3eth.eth.getAccounts();
 vm.accountEth = accountsEth[0];
 onConnectEth();
}

function onConnectEth() {
    // Subscribe to accounts change
    ethereum.on("accountsChanged", (accounts) => {
      (accounts.length == 0) ? vm.accountEth = '' : vm.accountEth = accounts[0];
      refreshAccountDataEth()
    });
   

    // Subscribe to networkId change
    ethereum.on("chainChanged", (chainId) => {
      vm.ethChainId = chainId; 
      refreshAccountDataEth();
    });

    refreshAccountDataEth();
    setInterval(refreshAccountDataEth,10000);
    
  }

  function alertEth() {
    (vm.chainTo.id == '0x61') ? vm.balanceFrom = '-': vm.balanceTo = '-';
    exchButtons(0,0,'eth');
    document.getElementById('alerteth').innerHTML ='&#9888; Connect MetaMask to the Rinkeby Test Network!';
  }

function refreshAccountDataEth() {
  if (vm.accountEth != '') {
    vm.buttonEth = vm.accountEth.substr(0,6) + '...' + vm.accountEth.substr(38);
  } else {vm.buttonEth = 'Connect to Metamask'}
  if (vm.ethChainId != '0x4') {alertEth(); return}
    (vm.chainTo.id == '0x4') ? vm.accountTo = vm.accountEth : vm.accountFrom = vm.accountEth;
    fetchSwapDataEth();
    fetchLiquidityDataEth()
    exchButtons(1,1,'eth');
    document.getElementById('alerteth').innerHTML ='';
  }

   
// BSC wallet

async function connectBsc() {
  if (vm.buttonBsc == "Install Binance wallet") {window.open("https://docs.binance.org/smart-chain/wallet/binance.html"); return}
 //await BinanceChain.enable();
 vm.bscChainId = await web3bsc.eth.getChainId(); //alert(vm.bscChainId);
 const accountsBsc = await web3bsc.eth.getAccounts();
 vm.accountBsc = accountsBsc[0];// alert(vm.accountBsc)
 onConnectBsc();
}

function onConnectBsc() {
    // Subscribe to accounts change
    BinanceChain.on("accountsChanged", (accounts) => {
      vm.accountBsc = accounts[0];
      refreshAccountDataBsc()
    });
   
    BinanceChain.on("chainChanged", (chainId) => {
      vm.bscChainId = chainId;
      refreshAccountDataBsc();
    });

    refreshAccountDataBsc()
    setInterval(refreshAccountDataBsc,10000);
   
  }

function alertBsc() {
  (vm.chainTo.id == '0x61') ? vm.balanceTo = '-': vm.balanceFrom = '-';
  exchButtons(0,0,'bsc');
  document.getElementById('alertbsc').innerHTML ='&#9888; Connect Binance wallet to the BSC testnet!';

}

function refreshAccountDataBsc() {
    
    if (vm.accountBsc != '') {
      vm.buttonBsc = vm.accountBsc.substr(0,6) + '...' + vm.accountBsc.substr(38);
    } else {vm.buttonBsc = 'Connect to Binance wallet'}
    if (vm.bscChainId != '0x61') {alertBsc(); return}
    (vm.chainTo.id == '0x61') ? vm.accountTo = vm.accountBsc : vm.accountFrom = vm.accountBsc;
    fetchSwapDataBsc();
    fetchLiquidityDataBsc()
    exchButtons(1,1,'bsc')
    document.getElementById('alertbsc').innerHTML ='';
    }


      
//BLOCKCHAIN integration
//exchange tab
// fetch accounts data
async function fetchSwapDataBsc() {
 
if (vm.chainTo.id == '0x61') {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenTo.addr);
   tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = Math.round(bal*1e-10)/1e8;})
} else {
  
  const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = Math.round(bal*1e-10)/1e8;})
}

}

async function fetchSwapDataEth() {
 
  if (vm.chainTo.id == '0x4') {
    const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenTo.addr);
    tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = Math.round(bal*1e-10)/1e8;})
} else {//alert(vm.tokenFrom.addr +' '+ vm.accountFrom);
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = Math.round(bal*1e-10)/1e8;})
}

}

//liquidity tab
async function fetchLiquidityDataEth() {
  
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenLiqEth.addr);
  tokenContract.methods.balanceOf(vm.accountEth).call().then(function (bal) {
  vm.balanceLiqEth = Math.round(bal*1e-10)/1e8;})

}

async function fetchLiquidityDataBsc() {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenLiqBsc.addr);
    tokenContract.methods.balanceOf(vm.accountBsc).call().then(function (bal) {
    vm.balanceLiqBsc = Math.round(bal*1e-10)/1e8;})
}


var ae = ab = se = sb = 0;
function exchButtons(a,s,chain) {
  
  if (chain == 'eth') { ae = a, se = s}
  if (chain == 'bsc') { ab = a, sb = s}
  
  var aa = ae*ab, ss = se*sb;
  //alert(aa+' '+ss);
  if (aa == 1) document.querySelector("#approve").removeAttribute("disabled"); else document.querySelector("#approve").setAttribute("disabled", "disabled");
  if (ss == 1) document.querySelector("#swap").removeAttribute("disabled"); else document.querySelector("#swap").setAttribute("disabled", "disabled");


  }



