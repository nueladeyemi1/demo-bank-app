'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)/(1000 * 60 * 60 * 24));

  const daysPassed = calDaysPassed(new Date (), date)

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: currency,
}).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  
  const movs = sort ? acc.movements.slice().sort((a, b) => a-b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate (date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);


    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
      </div>
      `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};



const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) /100).filter(int => int >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};



const createUsernames = function (accounts) {
  accounts.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map( function(firstValue) {
      return firstValue[0]
    }).join('');
  })
};

createUsernames(accounts);

const updateUI = function (acc) {
      //DISPLAY MOVEMENT
      displayMovements(acc); 

      //DISPLAY BALANCE
      calcDisplayBalance(acc);
  
      //DISPLAY SUMMARY
      calcDisplaySummary(acc);
};


const startLogOutTimer = function () {
 const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
  
  //In each call, print the remaining time to UI
  labelTimer.textContent = `${min}:${sec}`;


  //When 0 seconds, log user out
  if (time === 0) {
    clearInterval(timer);
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
    }
    //Decrease 1 seconds
    time--;
  };
  //set the time to 5 minutes
  let time = 120;

  //Call the timer every seconds
  tick();
const timer = setInterval(tick, 1000);

 return timer;
}

//EVENT HANDLER
let currentAccount, timer;

//FAKE ALWAYS LOGGED IN

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;




btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === +(inputLoginPin.value)) {
    //DISPLAY UI AND MESSAGE

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //CREATE CURRENT DATE
    const now = new Date();
    const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long'
};
// const locale = navigator.language;

labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //CLEAR INPUT FIELD
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur()

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //UPDATE UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if ( amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
setTimeout(function() {    //ADD MOVEMENT
    currentAccount.movements.push(amount);

    //ADD LOAN DATE

    currentAccount.movementsDates.push(new Date().toISOString());

    //UPDATE UI LOAN
    updateUI(currentAccount);

        //RESET TIMER
        clearInterval(timer);
        timer = startLogOutTimer();

    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    //DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //UPDATE UI
    updateUI(currentAccount);

    //RESET TIMER
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputCloseUsername.value = inputClosePin.value = '';
});


btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && +(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex (acc => acc.username === currentAccount.username);
    console.log(index)

    //DELETE ACCOUNT
    accounts.splice(index, 1);

    //HIDE UI
    containerApp.style.opacity = 0;
  }
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// const sumCounter = function (n) {
//   let sum = 0;
//   for (let i = 0; i <= n; i++) {
//     sum += i;
//   }
//   console.log(sum)
// };

// sumCounter(5);

// const sumCounter2 = function (n) {
//   console.log(n * (n + 1)/2);
// }

// sumCounter2(5);

// let t1 = performance.now();
// sumCounter(1000000000);
// let t2 = performance.now();
// console.log(`This Elapsed: ${(t1 - t2)/1000} seconds.`)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//SLICE
// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2)); //Doesn't mutate the original array and It output the slice
// console.log(arr.slice(2,4));
// console.log(arr.slice(-1));
// console.log(arr.slice()); //To create a shallow copy of an array
// console.log([...arr]);

// //SPLICE
// //.splice(position,leadCount)
// console.log(arr.splice(0,2));
// console.log(arr);
// //Splice is useful in deleting element from array

// //REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //CONCAT

// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN
// console.log(letters.join('-'));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// //the first entry of the for array is the index.

// for(const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`${i+1}. You deposited ${Math.abs(mov)}`)
//   } else {
//     console.log(`${i+1}. You withdrew ${Math.abs(mov)}`);
//   }
  
// }

// console.log('---------------FOREACH-----------------')

// //Index are the second argument of the callback function

// movements.forEach(function (movs, index) {
//   if (movs > 0) {
//     console.log(`${index + 1}. You deposited ${Math.abs(movs)}`)
//   } else {
//     console.log(`${index + 1}. You withdrew ${Math.abs(movs)}`);
//   }
// });


// //


// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// console.log(currencies);

// currencies.forEach(function(value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //Set
// //I can use "new Set" to remove duplicate from array that is generated from API

// const currenciesUnique = ['USD', 'GBP', 'USD', 'EUR', 'EUR', 'Trial', 'Trial'];

// const currenciesUnique1 = new Set (currenciesUnique);
// console.log(currenciesUnique1);
// // console.log(currenciesUnique);



//First Coding Challenge

// const checkDogs = function (dogsJulia, dogsKate) {
//   let shallowJulia = [...dogsJulia];
//   shallowJulia.splice(0, 1);
//   shallowJulia.splice(-2);
//   // shallowJulia.splice(-1)
// const newCorrectedArray = [...shallowJulia, ...dogsKate];

// newCorrectedArray.forEach(function (dogAge, i) {
//   if(dogAge >= 3) {
//     console.log(`dog number ${i + 1} is an Adult, and is ${dogAge} years old`)
//   } else {
//     console.log(`dog number ${i + 1} is ${dogAge} years old and it is a Puppy`)
//   }
// })
//   // console.log(shallowJulia);
//   // console.log(dogsJulia);
//   // console.log(newCorrectedArray);
// };

// let dogsJulia, dogsKate;

// console.log('----------TEST DATA 1----------')

// dogsJulia = [3 , 5, 2, 12, 7];
// dogsKate = [4, 1, 15, 8, 3];

// checkDogs(dogsJulia, dogsKate);

// console.log('----------TEST DATA 2----------')

// dogsJulia = [9, 16, 6, 8, 3];
// dogsKate = [10, 5, 6, 1, 4];

// checkDogs(dogsJulia, dogsKate);


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;

// const movementsUSD = movements.map(function(mov) {
//   return Math.floor(mov * euroToUsd);
// })

// console.log(movements);
// console.log(movementsUSD);

// const movementsDescriptions = movements.map((mov, i) => 
//   `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
// );

// console.log(movementsDescriptions);

//WORKING WITH FILTER


// const howFilterHows = movements.filter(function(value1) {
//   return value1 < 0
// });

// const howFilterHows2 = movements.filter(function(value2) {
//   return value2 > 0
// });

// console.log(howFilterHows);
// console.log(howFilterHows2);


// const balance = movements.reduce(function(accom, cur) {
//   return accom + cur;
// }, 0);

// console.log(balance);

// const calcAverageHumanAge = function(dogAgeArray) {
//   // console.log(dogAgeArray);
//   let humanAge = dogAgeArray.map(function (dogAge, i) {
//     // console.log(dogAge);
//     if(dogAge <= 2) {
//       return 2 * dogAge;
//     } else {
//       return 16 + dogAge * 4;
//     }
//   });

//   console.log(humanAge);

//   const exclude = humanAge.filter(function (elem) {
//     return elem >= 18
//   }) 

//   console.log(exclude)

//   const sumAge = exclude.reduce(function(accomm, current) {
//     return accomm + current;
//   },0)

//   const averageAge = sumAge/exclude.length
//   console.log(averageAge);
// };

// calcAverageHumanAge([5, 2, 1, 6, 15, 8]);


// const calcAverageHumanAge = dogAgeArray  =>
//   dogAgeArray.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   ).filter(elem => elem >= 18).reduce((accomm, current, i, arr) => accomm + current/arr.length,0);
// ;
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

// for (const account of accounts) {
//   if(account.owner === 'Jessica Davis') {
//     console.log(account)
//   }
// }


// const owners = ['Jonas', 'Zach'  , 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// console.log(movements);

// console.log(movements.sort());

// movements.sort((a, b) => {
//   if( a > b) {
//     return 1
//   }
//   if (a < b) {
//     return -1
//   }
// });

// console.log(movements);

// movements.sort((a, b) => {
//   if( a > b) {
//     return -1
//   }
//   if (a < b) {
//     return 1
//   }
// });

// console.log(movements);

// movements.sort((a, b) => a-b);
// console.log(movements); 

// TEST DATA:
// const dogs = [
//   { weight: 22, curfood: 250, owners: ['Alice', 'Bob']},
//   { weight: 8, curfood: 200, owners: ['Matilda']},
//   { weight: 13, curfood: 275, owners: ['Sarah', 'John']},
//   { weight: 32, curfood: 340, owners: ['Michael']}
// ];

// dogs.forEach(recom => recom.RecommendedFood = Math.floor(recom.weight ** 0.75 * 28));

// console.log(dogs);


// const dogSarah = dogs.find(owns => owns.owners.includes('Sarah')
// )

// console.log(dogSarah)

// const arrayOfDogTooMuch = dogs.filter(dog => dog.curfood > dog.RecommendedFood).flatMap(dog => dog.owners);

// console.log(arrayOfDogTooMuch);

// const arrayOfDogTooLittle = dogs.filter(dog => dog.curfood < dog.RecommendedFood).flatMap(dog =>  dog.owners);
// console.log(arrayOfDogTooLittle);

// console.log(dogs.some(dog => dog.curfood === dog.RecommendedFood));

// const checker = dog => dog.curfood > dog.RecommendedFood * 0.90 && dog.curfood < dog.RecommendedFood * 1.10;

// console.log(dogs.some(checker));

// console.log(dogs.filter(checker));





///////////////////////////////









// const displayMovements = function (movements, sort = false) {
//   containerMovements.innerHTML = '';

//   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__value">${mov}€</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// const calcDisplayBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `${acc.balance}€`;
// };

// const calcDisplaySummary = function (acc) {
//   const incomes = acc.movements
//     .filter(mov => mov > 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumIn.textContent = `${incomes}€`;

//   const out = acc.movements
//     .filter(mov => mov < 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumOut.textContent = `${Math.abs(out)}€`;

//   const interest = acc.movements
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * acc.interestRate) / 100)
//     .filter((int, i, arr) => {
//       // console.log(arr);
//       return int >= 1;
//     })
//     .reduce((acc, int) => acc + int, 0);
//   labelSumInterest.textContent = `${interest}€`;
// };

// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUsernames(accounts);

// const updateUI = function (acc) {
//   // Display movements
//   displayMovements(acc.movements);

//   // Display balance
//   calcDisplayBalance(acc);

//   // Display summary
//   calcDisplaySummary(acc);
// };

// ///////////////////////////////////////
// // Event handlers
// let currentAccount;

// btnLogin.addEventListener('click', function (e) {
//   // Prevent form from submitting
//   e.preventDefault();

//   currentAccount = accounts.find(
//     acc => acc.username === inputLoginUsername.value
//   );
//   console.log(currentAccount);

//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     // Display UI and message
//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;
//     containerApp.style.opacity = 100;

//     // Clear input fields
//     inputLoginUsername.value = inputLoginPin.value = '';
//     inputLoginPin.blur();

//     // Update UI
//     updateUI(currentAccount);
//   }
// });

// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     acc => acc.username === inputTransferTo.value
//   );
//   inputTransferAmount.value = inputTransferTo.value = '';

//   if (
//     amount > 0 &&
//     receiverAcc &&
//     currentAccount.balance >= amount &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     // Doing the transfer
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);

//     // Update UI
//     updateUI(currentAccount);
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();

//   const amount = Number(inputLoanAmount.value);

//   if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
//     // Add movement
//     currentAccount.movements.push(amount);

//     // Update UI
//     updateUI(currentAccount);
//   }
//   inputLoanAmount.value = '';
// });

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();

//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username
//     );
//     console.log(index);
//     // .indexOf(23)

//     // Delete account
//     accounts.splice(index, 1);

//     // Hide UI
//     containerApp.style.opacity = 0;
//   }

//   inputCloseUsername.value = inputClosePin.value = '';
// });

// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displayMovements(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calDaysPassed = (date1, date2) => Math.abs(date2 - date1)/(1000 * 60 * 60 * 24);

// const days1 = calDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
// console.log(days1)

// const num = 3884764.23;
// const options = {
//   style: 'currency',
//   unit: 'celsius'
// }

// // console.log('US: ', new Intl.NumberFormat('en-US').format(num));

// setTimeout((ing1, ing2)=> console.log(`Here is your Pizza with ${ing1} and ${ing2}`), 3000, 'Olives', 'Spinach');

