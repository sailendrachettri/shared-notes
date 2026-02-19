export function getGreeting() {
  const hour = new Date().getHours();

  let greeting = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Evening";
  } else {
    greeting = "Hello";
  }


  return greeting;
}
