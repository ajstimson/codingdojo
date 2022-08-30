const cars = ["Tesla", "Mercedes", "Honda"];
const [randomCar] = cars;
const [, otherRandomCar] = cars;
//Predict the output
console.log(randomCar);
//Output: Tesla
console.log(otherRandomCar);
//Output: Mercedes

const employee = {
  name: "Elon",
  age: 47,
  company: "Tesla",
};
const { name: otherName } = employee;
//Predict the output
console.log(name);
//Output: empty
console.log(otherName);
//Output: Elon

const person = {
  name: "Phil Smith",
  age: 47,
  height: "6 feet",
};
const password = "12345";
const { password: hashedPassword } = person;
//Predict the output
console.log(password);
// Output: '12345'
console.log(hashedPassword);
// Output: undefined

const numbers = [8, 2, 3, 5, 6, 1, 67, 12, 2];
//[,first] would = 2
const [, first] = numbers;
//[,,,second] would = 5
const [, , , second] = numbers;
//[,,,,,,,,third] would = 2
const [, , , , , , , , third] = numbers;
//Predict the output
console.log(first == second);
//Output: false
console.log(first == third);
//Output: true

const lastTest = {
  key: "value",
  secondKey: [1, 5, 1, 8, 3, 3],
};

const { key } = lastTest;
const { secondKey } = lastTest;
const [, willThisWork] = secondKey;
//Predict the output
console.log(key);
//Output: value
console.log(secondKey);
//Output: [1, 5, 1, 8, 3, 3]
console.log(secondKey[0]);
//Output: 1
console.log(willThisWork);
//Output: 5
