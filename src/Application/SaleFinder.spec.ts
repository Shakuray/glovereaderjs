import ProductNotFound from "@/Domain/ProductNotFound";
import FindSaleName, { DetectLayout, LayoutNames } from "./SaleFinder";

describe("DetectLayout", () => {
    test.each([
        ["epis itw fast maig 2026", "ITW FAST"],
        ["EPIS 2K", "ITW FAST"],
        ["epis esparraguera", "ESPARRAGUERA"],
        ["epis zaragoza", "ZARAGOZA"],
        ["EPIS ALEMANYA", "ALEMANYA"],
        ["epis itw components 2026", "ITW COMP"],
        ["epis la garriga", "LA GARRIGA"],
    ])("detects %s as %s", (listType, layout) => {
        expect(DetectLayout(listType)).toBe(layout);
    });

    test("returns undefined when no rule matches", () => {
        expect(DetectLayout("epis unknown center")).toBeUndefined();
    });

    test("only detects existing layouts", () => {
        expect(LayoutNames()).toContain(DetectLayout("itw comp"));
    });
});

describe("FindSaleName", () => {
    test("throws ProductNotFound for a line missing in the layout", () => {
        expect(() => FindSaleName("ALEMANYA", "00333333", "999")).toThrow(ProductNotFound);
    });
});
