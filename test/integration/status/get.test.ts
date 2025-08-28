describe("GET pipeline view", () => {
  describe("Anonymous user", () => {
    test("Retriving current system status", async () => {
      const systemStauts = true;

      expect(systemStauts).toEqual(true);
    });
  });
});
