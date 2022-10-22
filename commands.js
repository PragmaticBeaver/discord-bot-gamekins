const COMMAND_TYPES = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  TEXT_COMMAND: 3,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
};

export const COMMAND_NAMES = {
  TEST: "test",
  DEALS: "deals",
  STEAM_DEALS: "show-deals-steam",
  FREE: "free"
};

export const TEST_COMMAND = {
  name: COMMAND_NAMES.TEST,
  description: "Basic guild command",
  type: 1,
};

export const SHOW_DEALS = {
  name: COMMAND_NAMES.DEALS,
  description: "Show the top deals from a given platform.",
  options: [
    {
      type: COMMAND_TYPES.TEXT_COMMAND,
      name: "platform",
      description: "The platform of choice.",
      required: true
    }
  ]
};

export const FREE = {
  name: COMMAND_NAMES.FREE,
  description: "Show free games.",
  options: [
    {
      type: COMMAND_TYPES.TEXT_COMMAND,
      name: "country",
      description: "The ISO Country Code; US, GB, DE, etc.",
      required: true
    }
  ]
};
