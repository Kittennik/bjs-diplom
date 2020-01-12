class Profile {
    constructor({ username, name: { firstName, lastName }, password }) {	
        this.username = username;	
        this.name = {	
            firstName,	
            lastName,	
        };	
        this.password = password;
    }
  
    createNewUser(callback) {        
      return ApiConnector.createUser({ username: this.username, name: this.name, password: this.password },  (err, data) => {
        console.log(`Creating user ${this.username}...`);
        callback(err, data);
      });
    } 
  
    authorization(callback) {
      return ApiConnector.performLogin({ username: this.username, password: this.password },  (err, data) => {
        console.log(`Authorizing user ${this.username}...`);
        callback(err, data);
      });     
    }
  
    addMoneyToWallet({ currency, amount }, callback) {
      return ApiConnector.addMoney({ currency, amount }, (err, data) => {
        console.log(`Adding ${amount} of ${currency} to ${this.username}...`);
        callback(err, data);
      });
    }
      
    currencyConversion({ fromCurrency, targetCurrency, targetAmount }, callback) {
      return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
        console.log(`Convert ${fromCurrency} to ${targetCurrency}. ${targetAmount} of ${targetCurrency} received.`);
        callback(err, data);
      });
    }
      
    transferMoneyTo({ to, amount }, callback) {
      return ApiConnector.transferMoney({ to, amount }, (err, data) => {
        console.log(`Transfer ${amount} from ${this.username} to ${to}`);
        callback(err, data);
      });
    }
}
  
function receivingExchangeRates(callback) {
   return ApiConnector.getStocks((err, data) => {
   console.log(`Getting stocks info...`);
   callback(err, data);
   });   
}
  
function main() {
    
    const firstUser = new Profile({
      username: 'Cop22',
      name: { firstName: 'Gleb', lastName: 'Giglov' },
      password: 'mb23z6'
    });
  
    const secondUser = new Profile({
      username: 'Miu-Miu',
      name: { firstName: 'Laura', lastName: 'Lerout' },
      password: '12345'
    });
  
  
    firstUser.createNewUser((err, data) => {
      if (err) {
        console.error(`Error during creating user ${firstUser.username}.`);
      } 
      else {
        console.log(`${firstUser.username} is created.`);
  
        firstUser.authorization((err, data) => {
            if (err) {
              console.error(`Error authorization of ${firstUser.username}.`);
            } 
            else {
              console.log(`${firstUser.username} is authorized.`);
  
              firstUser.addMoneyToWallet({ currency: 'RUB', amount: 500000 }, (err, data) => {
                if (err) {
                  console.error(`Error during adding money to ${firstUser.username}.`);
                } 
                else {
                  console.log(`Added 500000 RUB to ${firstUser.username}.`);
       
                receivingExchangeRates((err, data) => {
                  if (err) {
                    console.error('Error during converting');
                  } 
                  else {
                    var currencyRate, valueExchange;
                    currencyRate = data;
                    valueExchange = currencyRate[0].RUB_NETCOIN;
                    console.log(`Exchange rate is ${valueExchange}`);
                      
                    firstUser.currencyConversion({ fromCurrency: 'RUB', targetCurrency: 'NETCOIN', targetAmount: (10000 * valueExchange) }, (err, data) => {
                    if (err) {
                      console.error('Error during convertation');
                    } 
                    else {
                      console.log(` 10 000 RUB converted to netcoin.`); 
                      
                        secondUser.createNewUser((err, data) => {
                            if (err) {
                             console.error(`Error during creating user ${secondUser.username}.`);
                            }  
                            else {
                            console.log(`${secondUser.username} is created.`);
                      
                            firstUser.transferMoneyTo({ to: secondUser.username, amount: 5}, (err, data) => {
                                if (err) {
                                console.error(`Error during send money to ${secondUser.username}`);
                                } 
                                else {
                                console.log(`${secondUser.username} has got 5 NETCOINS.`); 
                        }});    
                    }});    
                }});
              }});                   
          }});
       }});        
    }});   
 }
  
   
main();