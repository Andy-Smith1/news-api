const { formatData, countComments } = require("../db/utils/data-manipulation");
const db = require("../db/connection");
const { userData } = require("../db/data/test-data/index");

describe("formatData", () => {
  test("should return an array", () => {
    const actual = formatData([{}]);
    expect(Array.isArray(actual)).toBe(true);
  });
  test("should return a nested array with values from each property in object", () => {
    const testTopic = [
      { description: "Code is love, code is life", slug: "coding" },
    ];
    const topicExpect = [["Code is love, code is life", "coding"]];
    expect(formatData(testTopic)).toEqual(topicExpect);
    const testUsers = [
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      },
    ];
    const usersExpect = [
      [
        "tickle122",
        "Tom Tickle",
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      ],
    ];
    expect(formatData(testUsers)).toEqual(usersExpect);
  });
  test("works with multiple objects in array", () => {
    const input = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
      {
        description: "what books are made of",
        slug: "paper",
      },
    ];
    const expected = [
      ["The man, the Mitch, the legend", "mitch"],
      ["Not dogs", "cats"],
      ["what books are made of", "paper"],
    ];
    expect(formatData(input)).toEqual(expected);
    expect(formatData(userData)).toHaveLength(4);
  });
  test("input should not be mutated", () => {
    const input = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
    ];
    formatData(input);
    expect(input).toEqual([
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
    ]);
  });
  test("returned array should hold different reference in memory", () => {
    const input = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
    ];
    expect(formatData(input)).not.toBe(input);
  });
});
