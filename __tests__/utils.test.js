const {
  formatTopics,
  formatUsers,
  formatArticles,
} = require("../db/utils/data-manipulation");

describe("formatTopics", () => {
  test("should return an array", () => {
    const actual = formatTopics([
      { description: "Code is love, code is life", slug: "coding" },
    ]);

    expect(Array.isArray(actual)).toBe(true);
  });
  test("should return nested arrays with each property ", () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
      {
        description: "Hey good looking, what you got cooking?",
        slug: "cooking",
      },
    ];
    const expected = [
      ["coding", "Code is love, code is life"],
      ["football", "FOOTIE!"],
      ["cooking", "Hey good looking, what you got cooking?"],
    ];

    expect(formatTopics(input)).toEqual(expected);
  });
  test("input should not be mutated", () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding" },
    ];
    const inputCopy = [
      { description: "Code is love, code is life", slug: "coding" },
    ];
    formatTopics(input);
    expect(input).toEqual(inputCopy);
  });
  test("returned array holds a different reference in memory", () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding" },
    ];
    const actual = formatTopics(input);
    expect(actual).not.toBe(input);
    expect(actual[0]).not.toBe(input[0]);
  });
});

describe("formatUsers", () => {
  test("should return an array", () => {
    const actual = formatUsers([
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      },
    ]);
    expect(Array.isArray(actual)).toBe(true);
  });
  test("should return a nested array with each property", () => {
    const actual = formatUsers([
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      },
    ]);
    const expected = [
      [
        "tickle122",
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
        "Tom Tickle",
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("input should not be mutated", () => {
    const input = [{ a: 1, b: 2, c: 3 }];
    formatUsers(input);
    expect(input).toEqual([{ a: 1, b: 2, c: 3 }]);
  });
  test("returned array holds different reference in memory", () => {
    const input = [{ a: 1, b: 2, c: 3 }];
    const actual = formatUsers(input);
    expect(actual).not.toBe(input);
    expect(actual[0]).not.toBe(input[0]);
  });
});

describe("formatArticles", () => {
  test("should return an array", () => {
    const actual = formatArticles([{}]);
    expect(Array.isArray(actual)).toBe(true);
  });
  test("should return an array of nested arrays with each property", () => {
    const input = [
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body: "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: new Date(1589418120000),
        votes: 0,
      },
    ];
    const actual = formatArticles(input);
    expect(actual[0].length).toBe(6);
    expect(actual[0]).toContain("coding");
    expect(actual[0]).toContain("jessjelly");
  });
  test("input should not be mutated", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
    ];
    formatArticles(input);
    console.log(formatArticles(input));
    expect(input).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
    ]);
  });
});
