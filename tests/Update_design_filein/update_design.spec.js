import { test, expect } from "@playwright/test";
// import {readOrdersFromSheet, callSearchAndUpdate} from "./readcsv_list_item";
import {readOrdersFromSheet, callSearchAndUpdate} from "./readcsv_list_item_optimize";

test.only("Update design", async ({ page }) => {
    const customOrderNumbers = "RW-94397-88949  RJ-79633-67392 RB-93332-85348 RV-74927-25494 RD-22732-69262 RP-82932-52268 RJ-62552-62393 RG-74649-38599 RN-26226-36424 RZ-53786-44249 RM-64585-36538 RM-63247-58755 RQ-82659-49724 RP-73568-53994 RZ-93434-76645 RV-86575-24448 RR-22798-76988 RN-59254-33227 RG-54497-67392 RK-83332-72698 RB-58392-76735 RB-84798-43895 RP-86554-34332 RN-37852-28469 RZ-58896-59976 RG-53675-83885 RE-99325-63948 RN-78994-46332 RX-52242-87739 RW-67698-93357"

    const dataRead = await readOrdersFromSheet();
    await callSearchAndUpdate(customOrderNumbers, page, dataRead);
});