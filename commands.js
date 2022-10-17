// // Command containing options
// export const CHALLENGE_COMMAND = {
//   name: "challenge",
//   description: "Challenge to a match of rock paper scissors",
//   options: [
//     {
//       type: 3,
//       name: "object",
//       description: "Pick your object",
//       required: true,
//       choices: createCommandChoices(),
//     },
//   ],
//   type: 1,
// };


const COMMAND_TYPES = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
};

export const TEST_COMMAND = {
  name: "test",
  description: "Basic guild command",
  type: 1,
};

export const SHOW_STEAM_DEALS = {
  name: "show-deals-steam",
  description: "Show the top deals on steam",
  type: COMMAND_TYPES.SUB_COMMAND,
};

export const SHOW_STEAM_FREEBIES = {
  name: "show-freebies-steam",
  description: "Show free games on steam",
  type: COMMAND_TYPES.SUB_COMMAND,
};