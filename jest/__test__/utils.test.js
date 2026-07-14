import { sum } from '../app/utils';


describe("Testing Sum Function", () => {

    test("should return the sum of two numbers", () => {
        expect(sum(2, 3)).toBe(5);
    })

    test("should return the sum of negative numbers", () => {
        expect(sum(-2, -3)).toBe(-5);
    })

    test("should return the sum of a positive and a negative number", () => {
        expect(sum(2, -3)).toBe(-1);
    })
})
