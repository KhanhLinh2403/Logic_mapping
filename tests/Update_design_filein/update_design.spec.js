import { test, expect } from "@playwright/test";
// import {readOrdersFromSheet, callSearchAndUpdate} from "./readcsv_list_item";
import {readOrdersFromSheet, callSearchAndUpdate} from "./readcsv_list_item_optimize";

test.only("Update design", async ({ page }) => {
    const customOrderNumbers = "RR-52865-88352-F1 RE-95597-64744-F1 RQ-55882-99373-F6 RB-98242-53493-F1 RV-32868-55788-F1 RN-42783-37553-F1 RJ-25668-28874-F1 RK-97876-66229-F1 RK-97876-66229-F1 RK-39593-44442-F1 RQ-55882-99373-F5"

    const dataRead = await readOrdersFromSheet();
    await callSearchAndUpdate(customOrderNumbers, page, dataRead);
});