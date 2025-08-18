import { test, expect } from "@playwright/test";
import {readOrdersFromSheet, callSearchAndUpdate} from "./readcsv_list_item";


test.only("Update design", async ({ page }) => {
    const customOrderNumbers = "RJ-86446-72697 RZ-48352-53228 RN-27485-65833"

    const dataRead = await readOrdersFromSheet();
    await callSearchAndUpdate(customOrderNumbers, page, dataRead);
});