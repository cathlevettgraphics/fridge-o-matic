/*********************
 *
 * FRIDGE-O-MATIC – BETTER NAME TO COME!!
 *
 *********************/

// Fridge shelf layout:
// topShelf = deli meat, leftovers – ready to eat
// middleShelf = cheese, yoghurt, butter – dairy
// bottomShelf = raw meat, raw fish – raw
// bottomDraw = vegetables, salad, fruit, herbs – fruit and veg
// doorShelf = condiments, wine, drinks, juice, jam – condimemnts and drinks

// user input
// ✅ weekly budget – use to create expense report
// ✅ get today's date – use to report when items are approaching use by date

// app
// ✅ input item – create item and push to data array
// ✅ Check food should be in fridge – if not, return
// ✅ create a random meal based on what is in fridge
// ✅ max number of items per shelf
// ✅ log in
// ✅ log out

// ✅ data structure
// {
//   itemName: pizza,
//   type: readyToEat,
//   shelf: top shelf,
//   number: 5
//   useByDate: today + 2 etc,
//   cost: 500,
//   fridgeItem: true
// }

/*********************
 *
 * CREATE APP + DATA STRUCTURE
 *
 *********************/

// Create the data structure – in this case an item of food
function createFoodItem({
  itemName = '',
  shelf = '',
  type = '',
  number = 1,
  useByDate = new Date(),
  cost = 0,
  fridgeItem = false,
  user = 'cath',
}) {
  return {
    itemName,
    shelf,
    type,
    number,
    useByDate,
    cost,
    fridgeItem,
    user,
  };
}

// Create the app that will use the data – in this case a fridge

function createFridgeApp(existingFood = []) {
  // Date format MM/DD/YY
  const today = new Date();
  let totalSpend;
  let userBudget; // in pennies
  const fridgeContentsAllShelves = [...existingFood];
  const maxItemsPerShelf = 15;

  const userIDs = [
    { name: 'cath', id: 1234 },
    { name: 'ed', id: 5678 },
  ];

  let currentUser = null;

  function checkAuth(token) {
    return currentUser && currentUser.sessionToken === token;
  }

  return {
    setUserBudget(amount) {
      userBudget = amount;
      return `You have set a budget of: £${(userBudget / 100).toFixed(
        2,
      )} for the week`;
    },
    createFoodItem(item) {
      if (!item.fridgeItem) {
        console.log(
          `The ${item.itemName} do not belong in the fridge – try the cupboard`,
        );
      } else {
        fridgeContentsAllShelves.push(item);
      }
    },
    calculateSpending() {
      const costPerItem = fridgeContentsAllShelves.map((item) => {
        return item.cost;
      });

      const numOfItems = fridgeContentsAllShelves.map((item) => {
        console.log;
        return item.number;
      });

      let totalIncMultiples = [];
      costPerItem.forEach((cost, index) => {
        const number = numOfItems[index];
        totalIncMultiples.push(cost * number);
      });

      const totalCost = totalIncMultiples.reduce((curr, acc) => {
        return curr + acc;
      }, 0);
      totalSpend = totalCost;
      return `You have spent £${(totalCost / 100).toFixed(
        2,
      )} on food so far this week`;
    },
    removeItemFromFridge(item) {
      const indexToDel = fridgeContentsAllShelves.findIndex(
        (food) => food.itemName === item,
      );
      const itemToDel = fridgeContentsAllShelves.find(
        (food) => food.itemName === item,
      );

      fridgeContentsAllShelves.splice(indexToDel, 1);
      console.log(
        `The ${itemToDel.itemName} has been removed from your fridge`,
      );
      return fridgeContentsAllShelves;
    },
    getUserBudget() {
      const overBudget = ((userBudget - totalSpend) / 100).toFixed(2);
      if (userBudget - totalSpend < 0) {
        return `You are £${Math.abs(overBudget).toFixed(
          2,
        )} over budget this month`;
      }
      return `Your remaining budget is: £${(
        (userBudget - totalSpend) /
        100
      ).toFixed(2)}`;
    },
    checkUseByDate(item) {
      const checkDate = fridgeContentsAllShelves.find(
        (food) => food.itemName === item,
      );

      const indexOfItem = fridgeContentsAllShelves.findIndex(
        (food) => food.itemName === item,
      );

      // Calculate time difference in milliseconds
      const expiresTime = checkDate.useByDate.getTime() - today.getTime();
      // console.log(expiresTime);

      // Calculate time in days until item's useby date
      const daysUntilExpires = Math.round(expiresTime / (1000 * 3600 * 24));
      let expiryReport;

      if (daysUntilExpires > 0) {
        expiryReport = {
          foodItem: item,
          useBy: fridgeContentsAllShelves[indexOfItem].useByDate.toDateString(),
          daysUntilExpires: daysUntilExpires,
        };
      } else {
        expiryReport = {
          foodItem: item,
          useBy: fridgeContentsAllShelves[indexOfItem].useByDate.toDateString(),
          daysPastBest: Math.abs(daysUntilExpires),
          message: "Caution: This product is past it's use by date",
        };
      }

      return expiryReport;
    },
    createRandomMeal() {
      // Loop four times to get random ingredients
      let randomMeal = [];
      for (let i = 0; i < 4; i += 1) {
        let num = Math.floor(Math.random() * fridgeContentsAllShelves.length);
        randomMeal.push(fridgeContentsAllShelves[num].itemName);
      }
      return `Random meal roulette: ${randomMeal.join(', ')}`;
    },
    logIn(userIdNum) {
      // Find current user
      const user = userIDs.find((user) => user.id === userIdNum);
      console.log('current user:', user);

      // create session token
      user.sessionToken = uuidv4();
      currentUser = user ? user : null;
      console.log('current user session:', currentUser);

      // if (currentUser) {
      //   return `Login successful, welcome ${currentUser.name}. what would you like to add to your fridge?`;
      // } else {
      //   return 'No userID found, please try again';
      // }

      return currentUser.sessionToken;
    },
    logOut() {
      currentUser = null;
      return 'You have logged out ... see you soon 😀';
    },
    getFridgeContents(token) {
      // !! This is the only method I've added the authToken to
      return checkAuth(token)
        ? fridgeContentsAllShelves
        : 'You are not authorised';
    },
    shelfCapacity() {
      // function to sum items on each shelf
      function getNumItems(data, shelf) {
        const sumItems = data
          .filter((item) => item.shelf === shelf)
          .map((item) => item.number)
          .reduce((acc, curr) => acc + curr);
        return sumItems;
      }

      const top = getNumItems(fridgeContentsAllShelves, 'top shelf');
      const middle = getNumItems(fridgeContentsAllShelves, 'middle shelf');
      const bottom = getNumItems(fridgeContentsAllShelves, 'bottom shelf');
      const draw = getNumItems(fridgeContentsAllShelves, 'bottom draw');
      const door = getNumItems(fridgeContentsAllShelves, 'door shelf');

      const totalItems = fridgeContentsAllShelves
        .map((item) => item.number)
        .reduce((acc, curr) => acc + curr);

      const shelfReport = {
        message: `You have a total of ${totalItems} items in your fridge. For maximum efficiency, we recomend no more than ${maxItemsPerShelf} items per shelf`,
        topShelf: `${top} items`,
        middleShelf: `${middle} items`,
        bottomShelf: `${bottom} items`,
        bottomDraw: `${draw} items`,
        doorShelf: `${door} items`,
      };
      return shelfReport;
      //
    },
    removeUser() {
      return fridgeContentsAllShelves.filter((name) => name.user !== 'cath');
    },
  };
}

// Existing food in fridge
existingFood = [
  {
    itemName: 'parmesan',
    shelf: 'middle shelf',
    type: 'dairy',
    number: 1,
    useByDate: new Date('01/30/2021'),
    cost: 0,
    fridgeItem: true,
    user: 'cath',
  },
  {
    itemName: 'blue cheese',
    shelf: 'middle shelf',
    type: 'Condimemnts and drink',
    number: 1,
    useByDate: new Date('01/30/2021'),
    cost: 0,
    fridgeItem: true,
    user: 'cath',
  },
  {
    itemName: 'tofu',
    shelf: 'top shelf',
    type: 'ready to eat',
    number: 3,
    useByDate: new Date('01/02/2021'),
    cost: 0,
    fridgeItem: true,
    user: 'cath',
  },
  {
    itemName: 'green beans',
    shelf: 'bottom draw',
    type: 'ready to eat',
    number: 1,
    useByDate: new Date('31/11/2021'),
    cost: 0,
    fridgeItem: true,
    user: 'cath',
  },
];

// APP
const fridgeApp = createFridgeApp(existingFood);

/*********************
 *
 * Add a bunch of dummy data to all fridge shelves
 *
 *********************/

fridgeApp.createFoodItem({
  itemName: 'hot sauce',
  shelf: 'door shelf',
  type: 'Condimemnts and drink',
  number: 2,
  useByDate: new Date('11/30/2021'),
  cost: 210,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'cheese',
  shelf: 'middle shelf',
  type: 'dairy',
  number: 1,
  useByDate: new Date('02/26/2021'),
  cost: 460,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'pizza',
  type: 'readyToEat',
  shelf: 'top shelf',
  number: 2,
  useByDate: new Date('11/28/2020'),
  cost: 550,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'fish',
  shelf: 'bottom shelf',
  type: 'raw',
  number: 4,
  useByDate: new Date('11/26/2020'),
  cost: 500,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'butter',
  shelf: 'middle shelf',
  type: 'dairy',
  number: 1,
  useByDate: new Date('01/26/2021'),
  cost: 275,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'courgette',
  shelf: 'bottom draw',
  type: 'Fruit and veg',
  number: 3,
  useByDate: new Date('11/30/2020'),
  cost: 130,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'carrots',
  shelf: 'bottom draw',
  type: 'Fruit and veg',
  number: 1,
  useByDate: new Date('11/30/2020'),
  cost: 250,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'potatos',
  shelf: 'bottom draw',
  type: 'Fruit and veg',
  number: 1,
  useByDate: new Date('11/19/2020'),
  cost: 200,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'wine',
  shelf: 'door shelf',
  type: 'Condimemnts and drink',
  number: 1,
  useByDate: new Date('11/23/2021'),
  cost: 750,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'milk',
  shelf: 'door shelf',
  type: 'Condimemnts and drink',
  number: 2,
  useByDate: new Date('11/30/2020'),
  cost: 150,
  fridgeItem: true,
  user: 'cath',
});

fridgeApp.createFoodItem({
  itemName: 'bread',
  shelf: 'top shelf',
  type: 'ready to eat',
  number: 2,
  useByDate: new Date('11/22/2020'),
  cost: 150,
  fridgeItem: true,
  user: 'ed',
});

/*********************
 *
 * TESTING THE APP
 *
 *********************/

//  Log in user
console.log('----- 1. LOG IN ----------');
let token = fridgeApp.logIn(1234);
// console.log(fridgeApp.logIn(5678));

// Set user budget
console.log('----- 2. SET USER BUDGET');
console.log(fridgeApp.setUserBudget(6000));

// Create item that should not be in the fridge
console.log('----- 3. THIS FOOD SHOULD NOT GO IN THE FRIDGE ----------');
fridgeApp.createFoodItem({
  itemName: 'tinned tomatoes',
  shelf: 'door shelf',
  type: 'Condimemnts and drink',
  number: 2,
  useByDate: new Date('11/30/2022'),
  cost: 150,
  fridgeItem: false,
});

//Print the fridge's entire contents
console.log('----- 4. PRINT FRIDGE CONTENTS ----------');
console.log(
  `Here are all the items in your fridge: `,
  fridgeApp.getFridgeContents(token),
);

// Calculate user spending on food
console.log('----- 5. CALCULATE USER SPENDING ----------');
console.log(fridgeApp.calculateSpending());

// Get user budget
console.log('----- 6. GET REMAINING USER BUDGET OR OVERSPEND ----------');
console.log(fridgeApp.getUserBudget());

// Check useBy dates
console.log('----- 7. CHECK USE BY DATES ----------');
console.log('Your full expiry report:', fridgeApp.checkUseByDate('fish'));
console.log('Your full expiry report:', fridgeApp.checkUseByDate('hot sauce'));
console.log('Your full expiry report:', fridgeApp.checkUseByDate('courgette'));

console.log('----- 8. IF A FOOD IS OUT OF DATE ----------');
console.log(`Your full expiry report:`, fridgeApp.checkUseByDate('potatos'));

// remove item from fridge
console.log('----- 9. REMOVE ITEMS FROM FRIDGE ----------');
console.log(
  'The remaining items in your fridge are:',
  fridgeApp.removeItemFromFridge('cheese'),
);
console.log(
  'The remaining items in your fridge are:',
  fridgeApp.removeItemFromFridge('milk'),
);

// Create random, and possibly totally gross meal
console.log('----- 10. CREATE A RANDOM MEAL (could go either way!) ----------');
console.log(fridgeApp.createRandomMeal());

// Check how full your fridge is
console.log('----- 11. IS YOUR FRIDGE GETTING FULL? ----------');
console.log(`Fridge capacity: `, fridgeApp.shelfCapacity());

// Remove a specific user
console.log('----- 12. REMOVE SPECIFIC USER? ----------');
console.log(`Remove user Cath: `, fridgeApp.removeUser());

// Log out user
console.log('----- 13. LOG OUT ----------');
console.log(fridgeApp.logOut());

// Log in as different user
console.log('----- 14. LOG IN AS A DIFFERENT USER ----------');
token = fridgeApp.logIn(5678);

// Log out user
console.log('----- 15. LOG OUT ----------');
console.log(fridgeApp.logOut());

// Try and view fridge while not logged in
console.log(
  '----- 16. ATTEMPT TO SEE FRIDGE CONTENTS WHILE NOT LOGGED IN ----------',
);
console.log(
  `Here are all the items in your fridge: `,
  fridgeApp.getFridgeContents(token),
);

/*********************
 *
 * UTILITY FUNCTIONS
 *
 *********************/

// Helps us make ids
function uuidv4() {
  return 'xxxxxxxx-xxxx-xxxx-xxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
