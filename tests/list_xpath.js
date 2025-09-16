export const embroideryErrorPage = {
  menuEmbroideryError:
    "//ul[@class='nav MainMenu']//a[@href='/embroidery-error']",

  menuEmbroideryError:
    "//ul[@class='nav MainMenu']//a[@href='/embroidery-error']",

  filterDateRange:
    "//div[contains(@class,'FilterDateRange')]//span[contains(@class,'ant-calendar-picker-input')]",

  todayButton:
    "//div[contains(@class,'ant-calendar-panel')]//span[contains(text(),'Today')]",

  selectAllCheckbox:
    "//thead[contains(@class,'SewingRepairHeader')]//input[@type='checkbox']",

  thaoTacButton:
    "//div[contains(@class,'CustomSelect')]//button[@class='dropdown-toggle' and normalize-space(text())='Thao tác']",

  taiTaoLoButton:
    "//div[contains(@class,'CustomSelect')]//span[normalize-space(text())='Tái tạo lô']",

  inputNguoiTaiTaoLo:
    "//div[contains(@class,'ant-modal-body')]//label[normalize-space(text())='Tên người tái tạo lô']/ancestor::div[contains(@class,'ant-form-item')]//input[contains(@class,'ant-input')]",

  chonDoiTacDropdown:
    "//div[contains(@class,'ant-modal-body')]//label[normalize-space(text())='Chọn đối tác']/ancestor::div[contains(@class,'ant-form-item')]//div[contains(@class,'ant-select-selection')]",

  chonOptionDoiTac:
    "(//div[contains(@class,'ant-select-dropdown')])[last()]//li[@role='option'][2]",

  confirmTaiTaoButton:
    "//div[contains(@class,'ant-modal-footer')]//button[span[text()='Tái tạo']]",
};

export const orderMapping = {
  // Tabs & Filter
  unfulfilledTab:
    "//div[@class='ant-radio-group ant-radio-group-solid']//span[text()='Unfulfilled']",
  filterUS: '//div[@class="FilterOptions"]//span[normalize-space(text())="US"]',

  // Order list
  firstOrderLink: '//tbody/tr[1]/td[contains(@class, "OrderCode")]/a[1]',
  orderNumberTitle:
    '//h1[contains(@class, "PageTitle") and contains(@class, "OrderNumber")]',

  // Select product flow
  selectProductBtn: "//button[text()='Select product']",
  searchProductInput: 'input.ant-input[placeholder="Search for title..."]',
  firstProductItem:
    '//div[@class="ProductLineItems"]//div[contains(@class, "ProductLineItem")][1]',
  secondSizeRow: '//div[@class="ProductLineVariants"]/table/tbody/tr[2]',

  // Package split
  splitPackageBtn: "//div[contains(@class, 'OrderActions')]//a",
  firstPackItems:
    "(//div[contains(@class, 'split-package__body')])[1]//div[@class='split-package__order-item']",
  addNewPackageBtn:
    '//div[contains(@class, "split-package__footer")]//button[.//span[text()="Add new a package"]]',
  splitPackageBody: (i) =>
    `(//div[contains(@class, 'split-package__body')])[${i}]`,
  supplierDropdown: (i) =>
    `(//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select")])[${i}]`,

  // Dropdown
  visibleDropdown:
    "//div[contains(@class, 'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]",
  dropdownOption: ".ant-select-item-option",

  // Mark processing
  markProcessingBtn:
    '//div[contains(@class, "split-package__footer")]/button[2]',

  // Push
  pushAllBtn:
    "//div[@class='SectionInner']//button[contains(text(), 'Push all package')]",
  pushAllConfirmBtn:
    '//div[contains(@class, "ant-modal-footer")]//button[contains(@class, "ant-btn-primary") and span[text()="OK"]]',
  pushSingleBtn: '//div[@class="pushTo1C"]//button[contains(text(), "Push")]',
  pushSingleConfirmBtn:
    '//div[contains(@class, "footer-button")]//button[contains(text(), "Push")]',

  // Supplier select (for single-item case)
  supplierSelect:
    '//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select")]',
  supplierFirstOption:
    '(//div[contains(@class, "rc-virtual-list-holder-inner")]//div[contains(@class, "ant-select-item-option")])[1]',
};
