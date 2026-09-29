# Keyboard-nav polish — menu shortcut rollout

Every menu item across `apps/erp` and `apps/mes` that got a key in Task 6 of `2026-09-29-keyboard-nav-polish.md`. Keys are `MENU_ITEM_SHORTCUTS.<key>`. Delete items get no key (a user decision), so none are listed.

**205 items.**

| file | label | key |
|---|---|---|
| apps/erp/app/components/DefaultAttachmentsPanel.tsx | Download | download |
| apps/erp/app/components/Documents.tsx | Download | download |
| apps/erp/app/components/Documents.tsx | Download | download |
| apps/erp/app/components/Documents.tsx | View | view |
| apps/erp/app/components/RecordDocuments.tsx | Download | download |
| apps/erp/app/components/RecordDocuments.tsx | View in new tab | view |
| apps/erp/app/modules/accounting/ui/ChartOfAccounts/ChartOfAccountsTree.tsx | Edit (account menu) | edit |
| apps/erp/app/modules/accounting/ui/ChartOfAccounts/ChartOfAccountsTree.tsx | Edit Group | edit |
| apps/erp/app/modules/accounting/ui/CostCenters/CostCenterNode.tsx | Edit | edit |
| apps/erp/app/modules/accounting/ui/CostCenters/CostCentersListView.tsx | Edit | edit |
| apps/erp/app/modules/accounting/ui/Dimensions/DimensionsTable.tsx | Edit Dimension | edit |
| apps/erp/app/modules/accounting/ui/ExchangeRates/ExchangeRatesTable.tsx | Edit Currency | edit |
| apps/erp/app/modules/accounting/ui/FixedAssets/AssetClassesTable.tsx | Edit Asset Class | edit |
| apps/erp/app/modules/accounting/ui/FixedAssets/DepreciationRunTable.tsx | View Run | view |
| apps/erp/app/modules/accounting/ui/FixedAssets/FixedAssetsTable.tsx | Edit Asset / View Asset (ternary) | edit / view (same ternary) |
| apps/erp/app/modules/accounting/ui/JournalEntries/JournalEntriesTable.tsx | Edit Journal Entry / View Journal Entry (ternary) | edit / view (same ternary) |
| apps/erp/app/modules/accounting/ui/PaymentTerms/PaymentTermsTable.tsx | Edit Payment Term | edit |
| apps/erp/app/modules/accounting/ui/Periods/PeriodsTable.tsx | View Period (only when Closed; else Close Period) | view when closed, else none |
| apps/erp/app/modules/accounting/ui/Projects/ProjectsTable.tsx | Edit Project | edit |
| apps/erp/app/modules/documents/ui/Documents/DocumentsTable.tsx | Download | download |
| apps/erp/app/modules/documents/ui/Documents/DocumentsTable.tsx | Edit | edit |
| apps/erp/app/modules/inventory/ui/Batches/BatchPropertiesConfig.tsx | Edit | edit |
| apps/erp/app/modules/inventory/ui/InventoryCount/InventoryCountsTable.tsx | Edit Count / View Count | edit |
| apps/erp/app/modules/inventory/ui/Kanbans/KanbansTable.tsx | Edit | edit |
| apps/erp/app/modules/inventory/ui/Kanbans/KanbansTable.tsx | View Item Master | view |
| apps/erp/app/modules/inventory/ui/PickingLists/PickingListsTable.tsx | View Picking List / Edit Picking List | view |
| apps/erp/app/modules/inventory/ui/Receipts/ReceiptsTable.tsx | View Receipt / Edit Receipt | view |
| apps/erp/app/modules/inventory/ui/Shipments/ShipmentsTable.tsx | View Shipment / Edit Shipment | view |
| apps/erp/app/modules/inventory/ui/ShippingMethods/ShippingMethodsTable.tsx | Edit Shipping Method | edit |
| apps/erp/app/modules/inventory/ui/StockTransfers/StockTransferLines.tsx | Edit Line | edit |
| apps/erp/app/modules/inventory/ui/StockTransfers/StockTransfersTable.tsx | View Stock Transfer / Edit Stock Transfer | view |
| apps/erp/app/modules/inventory/ui/StorageRules/StorageRulesGroups.tsx | Edit Rule | edit |
| apps/erp/app/modules/inventory/ui/StorageRules/StorageRulesTable.tsx | Edit Rule | edit |
| apps/erp/app/modules/inventory/ui/StorageTypes/StorageTypesTable.tsx | Edit Storage Type | edit |
| apps/erp/app/modules/inventory/ui/StorageUnits/StorageUnitsTable.tsx | Edit Storage Unit | edit |
| apps/erp/app/modules/inventory/ui/Traceability/TrackedEntitiesTable.tsx | Edit Expiry | edit |
| apps/erp/app/modules/inventory/ui/Traceability/TrackedEntitiesTable.tsx | View Traceability Graph | view |
| apps/erp/app/modules/inventory/ui/WarehouseTransfers/WarehouseTransferLines.tsx | Edit | edit |
| apps/erp/app/modules/inventory/ui/WarehouseTransfers/WarehouseTransfersTable.tsx | View Transfer / Edit Transfer | view |
| apps/erp/app/modules/invoicing/ui/Memo/MemosTable.tsx | Edit Memo / View Memo (conditional) | edit / view by status |
| apps/erp/app/modules/invoicing/ui/Payment/PaymentsTable.tsx | Edit Payment / View Payment (conditional) | edit / view by status |
| apps/erp/app/modules/invoicing/ui/PurchaseInvoice/PurchaseInvoiceExplorer.tsx | View Item Master | view |
| apps/erp/app/modules/invoicing/ui/PurchaseInvoice/PurchaseInvoicesTable.tsx | Edit | edit |
| apps/erp/app/modules/invoicing/ui/SalesInvoice/SalesInvoiceExplorer.tsx | View Item Master | view |
| apps/erp/app/modules/invoicing/ui/SalesInvoice/SalesInvoicesTable.tsx | Edit | edit |
| apps/erp/app/modules/items/ui/ChangeNotice/ChangeNoticeExplorer.tsx | View Item Master | view |
| apps/erp/app/modules/items/ui/ChangeNotice/ChangeNoticesTable.tsx | Edit Change Notice | edit |
| apps/erp/app/modules/items/ui/ChangeNoticeActions/ChangeNoticeRequiredActionsTable.tsx | Edit Action | edit |
| apps/erp/app/modules/items/ui/ChangeNoticeTypes/ChangeNoticeTypesTable.tsx | Edit Type | edit |
| apps/erp/app/modules/items/ui/Consumables/ConsumablesTable.tsx | Edit ConsumableListItem | edit |
| apps/erp/app/modules/items/ui/Item/BillOfProcess.tsx | Duplicate | duplicate |
| apps/erp/app/modules/items/ui/Item/BillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/items/ui/Item/BillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/items/ui/Item/BillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/items/ui/Item/CustomerParts/CustomerParts.tsx | Edit Customer Part | edit |
| apps/erp/app/modules/items/ui/Item/ItemDocuments.tsx | Download | download |
| apps/erp/app/modules/items/ui/Item/ItemDocuments.tsx | Download | download |
| apps/erp/app/modules/items/ui/Item/ItemDocuments.tsx | View | view |
| apps/erp/app/modules/items/ui/Item/ItemForm.tsx | View Item Master | view |
| apps/erp/app/modules/items/ui/Item/MakeMethodTools.tsx | Duplicate Version | duplicate |
| apps/erp/app/modules/items/ui/Item/PickMethodForm.tsx | Open Audit Log | open |
| apps/erp/app/modules/items/ui/Item/UsedIn.tsx | Edit | edit |
| apps/erp/app/modules/items/ui/ItemPostingGroups/ItemPostingGroupsTable.tsx | Edit Item Group | edit |
| apps/erp/app/modules/items/ui/MaterialDimensions/MaterialDimensionsTable.tsx | Edit Material Dimension | edit |
| apps/erp/app/modules/items/ui/MaterialFinishes/MaterialFinishesTable.tsx | Edit Material Finish | edit |
| apps/erp/app/modules/items/ui/MaterialGrades/MaterialGradesTable.tsx | Edit Material Grade | edit |
| apps/erp/app/modules/items/ui/MaterialShapes/MaterialShapesTable.tsx | Edit Material Shape | edit |
| apps/erp/app/modules/items/ui/MaterialSubstances/MaterialSubstanceTable.tsx | Edit Substance | edit |
| apps/erp/app/modules/items/ui/MaterialTypes/MaterialTypesTable.tsx | Edit Material Type | edit |
| apps/erp/app/modules/items/ui/Materials/MaterialsTable.tsx | Edit Material | edit |
| apps/erp/app/modules/items/ui/Parts/ConfigurationParameters.tsx | Edit | edit |
| apps/erp/app/modules/items/ui/Parts/ConfigurationParameters.tsx | Edit | edit |
| apps/erp/app/modules/items/ui/Parts/PartsTable.tsx | Edit Part | edit |
| apps/erp/app/modules/items/ui/Services/ServicesTable.tsx | Edit Service | edit |
| apps/erp/app/modules/items/ui/Tools/ToolsTable.tsx | Edit Tool | edit |
| apps/erp/app/modules/items/ui/UnitOfMeasure/UnitOfMeasuresTable.tsx | Edit Unit of Measure | edit |
| apps/erp/app/modules/people/ui/Attributes/AttributeCategoriesTable.tsx | Edit Category | edit |
| apps/erp/app/modules/people/ui/Attributes/AttributeCategoriesTable.tsx | View Attributes | view |
| apps/erp/app/modules/people/ui/Attributes/AttributeCategoryDetail.tsx | Edit Attribute | edit |
| apps/erp/app/modules/people/ui/Departments/DepartmentNode.tsx | Edit | edit |
| apps/erp/app/modules/people/ui/Departments/DepartmentsListView.tsx | Edit | edit |
| apps/erp/app/modules/people/ui/Departments/DepartmentsTable.tsx | Edit Department | edit |
| apps/erp/app/modules/people/ui/Holidays/HolidaysTable.tsx | Edit Holiday | edit |
| apps/erp/app/modules/people/ui/People/PeopleTable.tsx | Edit Employee | edit |
| apps/erp/app/modules/people/ui/Shifts/ShiftsTable.tsx | Edit Shift | edit |
| apps/erp/app/modules/people/ui/Timecards/TimecardsTable.tsx | Edit Timecard | edit |
| apps/erp/app/modules/production/ui/Assemblies/AssemblyInstructionHeader.tsx | View Item Master | view |
| apps/erp/app/modules/production/ui/Assemblies/AssemblyInstructionsTable.tsx | Edit Instruction | edit |
| apps/erp/app/modules/production/ui/Batches/BatchDetailDrawer.tsx | View on schedule board | view |
| apps/erp/app/modules/production/ui/Batches/BatchesTable.tsx | View Batch | view |
| apps/erp/app/modules/production/ui/DemandProjection/DemandProjectionTable.tsx | Edit | edit |
| apps/erp/app/modules/production/ui/InspectionDocument/InspectionDocumentEditor.tsx | Download PDF | download |
| apps/erp/app/modules/production/ui/InspectionDocument/InspectionDocumentEditor.tsx | View Item Master | view |
| apps/erp/app/modules/production/ui/InspectionDocument/InspectionDocumentTable.tsx | Edit Diagram | edit |
| apps/erp/app/modules/production/ui/Jobs/JobBillOfProcess.tsx | Duplicate | duplicate |
| apps/erp/app/modules/production/ui/Jobs/JobBillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/production/ui/Jobs/JobBillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/production/ui/Jobs/JobBillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/production/ui/Jobs/JobDocuments.tsx | Download | download |
| apps/erp/app/modules/production/ui/Jobs/JobDocuments.tsx | Download | download |
| apps/erp/app/modules/production/ui/Jobs/JobDocuments.tsx | View | view |
| apps/erp/app/modules/production/ui/Jobs/JobsTable.tsx | Edit Job | edit |
| apps/erp/app/modules/production/ui/Jobs/ProductionEventsTable.tsx | Edit Event | edit |
| apps/erp/app/modules/production/ui/Jobs/ProductionQuantitiesTable.tsx | Edit Quantity | edit |
| apps/erp/app/modules/production/ui/Procedures/ProcedureExplorer.tsx | Edit Parameter | edit |
| apps/erp/app/modules/production/ui/Procedures/ProcedureExplorer.tsx | Edit Step | edit |
| apps/erp/app/modules/production/ui/Procedures/ProceduresTable.tsx | Edit Procedure | edit |
| apps/erp/app/modules/production/ui/Schedule/Kanban/components/BatchItemCard.tsx | Open in MES | open |
| apps/erp/app/modules/production/ui/Schedule/Kanban/components/ItemCard.tsx | Edit Operation | edit |
| apps/erp/app/modules/production/ui/Schedule/Kanban/components/ItemCard.tsx | Open in MES | open |
| apps/erp/app/modules/production/ui/Schedule/Kanban/components/JobCard.tsx | Edit Job | edit |
| apps/erp/app/modules/production/ui/ScrapReasons/ScrapReasonsTable.tsx | Edit Scrap Reason | edit |
| apps/erp/app/modules/purchasing/ui/PurchaseOrder/PurchaseOrderExplorer.tsx | View Item Master | view |
| apps/erp/app/modules/purchasing/ui/PurchaseOrder/PurchaseOrdersTable.tsx | Duplicate | duplicate |
| apps/erp/app/modules/purchasing/ui/PurchaseOrder/PurchaseOrdersTable.tsx | Edit | edit |
| apps/erp/app/modules/purchasing/ui/PurchaseReturnOrders/PurchaseReturnOrdersTable.tsx | Edit | edit |
| apps/erp/app/modules/purchasing/ui/PurchasingRfq/PurchasingRFQsTable.tsx | Edit | edit |
| apps/erp/app/modules/purchasing/ui/Supplier/SupplierBankAccounts.tsx | Edit | edit |
| apps/erp/app/modules/purchasing/ui/Supplier/SupplierProcesses.tsx | Edit Process | edit |
| apps/erp/app/modules/purchasing/ui/Supplier/SuppliersTable.tsx | Edit Supplier | edit |
| apps/erp/app/modules/purchasing/ui/SupplierInteraction/SupplierInteractionDocuments.tsx | Download | download |
| apps/erp/app/modules/purchasing/ui/SupplierInteraction/SupplierInteractionLineDocuments.tsx | Download | download |
| apps/erp/app/modules/purchasing/ui/SupplierQuote/SupplierQuoteExplorer.tsx | View Item Master | view |
| apps/erp/app/modules/purchasing/ui/SupplierQuote/SupplierQuotesTable.tsx | Edit | edit |
| apps/erp/app/modules/purchasing/ui/SupplierTypes/SupplierTypesTable.tsx | Edit Supplier Type | edit |
| apps/erp/app/modules/purchasing/ui/SupplierTypes/SupplierTypesTable.tsx | View Suppliers | view |
| apps/erp/app/modules/quality/ui/Actions/ActionsTable.tsx | View Issue | view |
| apps/erp/app/modules/quality/ui/Calibrations/GaugeCalibrationRecordsTable.tsx | Edit Record | edit |
| apps/erp/app/modules/quality/ui/Documents/QualityDocumentsTable.tsx | Edit Document | edit |
| apps/erp/app/modules/quality/ui/Gauge/GaugeForm.tsx | View | view |
| apps/erp/app/modules/quality/ui/Gauge/GaugesTable.tsx | Edit Gauge | edit |
| apps/erp/app/modules/quality/ui/GaugeTypes/GaugeTypesTable.tsx | Edit Type | edit |
| apps/erp/app/modules/quality/ui/Issue/IssuesTable.tsx | Edit Issue | edit |
| apps/erp/app/modules/quality/ui/IssueTypes/IssueTypesTable.tsx | Edit Type | edit |
| apps/erp/app/modules/quality/ui/IssueWorkflows/IssueWorkflowsTable.tsx | Edit Template | edit |
| apps/erp/app/modules/quality/ui/RequiredActions/RequiredActionsTable.tsx | Edit Action | edit |
| apps/erp/app/modules/quality/ui/RiskRegister/RiskRegistersTable.tsx | Edit Risk | edit |
| apps/erp/app/modules/resources/ui/Abilities/AbilitiesTable.tsx | View Ability | view |
| apps/erp/app/modules/resources/ui/Abilities/AbilityEmployeesTable.tsx | Edit Employee Ability | edit |
| apps/erp/app/modules/resources/ui/Contractors/ContractorsTable.tsx | Edit Contractor | edit |
| apps/erp/app/modules/resources/ui/FailureModes/FailureModesTable.tsx | Edit Failure Mode | edit |
| apps/erp/app/modules/resources/ui/Locations/LocationsTable.tsx | Edit Location | edit |
| apps/erp/app/modules/resources/ui/Maintenance/MaintenanceDispatchExplorer.tsx | Edit | edit |
| apps/erp/app/modules/resources/ui/Maintenance/MaintenanceDispatchNotes.tsx | Download | download |
| apps/erp/app/modules/resources/ui/Maintenance/MaintenanceDispatchesTable.tsx | Edit Dispatch | edit |
| apps/erp/app/modules/resources/ui/MaintenanceSchedule/MaintenanceSchedulesTable.tsx | Edit Schedule | edit |
| apps/erp/app/modules/resources/ui/Partners/PartnersTable.tsx | Edit Partner | edit |
| apps/erp/app/modules/resources/ui/Processes/ProcessForm.tsx | Edit Process | edit |
| apps/erp/app/modules/resources/ui/Processes/ProcessesTable.tsx | Edit Process | edit |
| apps/erp/app/modules/resources/ui/Suggestions/SuggestionsTable.tsx | View Suggestion | view |
| apps/erp/app/modules/resources/ui/Training/TrainingExplorer.tsx | Edit Question | edit |
| apps/erp/app/modules/resources/ui/Training/TrainingsTable.tsx | Edit Training | edit |
| apps/erp/app/modules/resources/ui/WorkCenters/WorkCentersTable.tsx | Edit Work Center | edit |
| apps/erp/app/modules/sales/ui/Customer/CustomerBankAccounts.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/CustomerPortals/CustomerPortalsTable.ee.tsx | Edit Portal | edit |
| apps/erp/app/modules/sales/ui/CustomerStatuses/CustomerStatusesTable.tsx | Edit Customer Status | edit |
| apps/erp/app/modules/sales/ui/CustomerStatuses/CustomerStatusesTable.tsx | View Customers | view |
| apps/erp/app/modules/sales/ui/CustomerTypes/CustomerTypesTable.tsx | Edit Customer Type | edit |
| apps/erp/app/modules/sales/ui/CustomerTypes/CustomerTypesTable.tsx | View Customers | view |
| apps/erp/app/modules/sales/ui/Customers/CustomersTable.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/NoQuoteReasons/NoQuoteReasonsTable.tsx | Edit Reason | edit |
| apps/erp/app/modules/sales/ui/Opportunity/OpportunityDocuments.tsx | Download | download |
| apps/erp/app/modules/sales/ui/Opportunity/OpportunityLineDocuments.tsx | Download | download |
| apps/erp/app/modules/sales/ui/Opportunity/OpportunityLineDocuments.tsx | Download | download |
| apps/erp/app/modules/sales/ui/Opportunity/OpportunityLineDocuments.tsx | View | view |
| apps/erp/app/modules/sales/ui/Pricing/PriceOverrideForm.tsx | View History | view |
| apps/erp/app/modules/sales/ui/Pricing/PriceOverridesTable.tsx | Duplicate to... | duplicate |
| apps/erp/app/modules/sales/ui/Pricing/PriceOverridesTable.tsx | Edit Pricing / Set Pricing (conditional) | edit (only when label is edit pricing) |
| apps/erp/app/modules/sales/ui/Pricing/PricingRulesTable.tsx | Duplicate Pricing Rule | duplicate |
| apps/erp/app/modules/sales/ui/Pricing/PricingRulesTable.tsx | Edit Pricing Rule | edit |
| apps/erp/app/modules/sales/ui/Quotes/QuoteBillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/Quotes/QuoteBillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/Quotes/QuoteBillOfProcess.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/Quotes/QuoteExplorer.tsx | View Item Master | view |
| apps/erp/app/modules/sales/ui/Quotes/QuoteHeader.tsx | Copy Quote | copy |
| apps/erp/app/modules/sales/ui/Quotes/QuoteLineForm.tsx | View Item Master | view |
| apps/erp/app/modules/sales/ui/Quotes/QuotesTable.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/ReturnReasons/ReturnReasonsTable.tsx | Edit Reason | edit |
| apps/erp/app/modules/sales/ui/SalesOrder/SalesOrderExplorer.tsx | View Item Master | view |
| apps/erp/app/modules/sales/ui/SalesOrder/SalesOrdersTable.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/SalesRFQ/SalesRFQsTable.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/SalesReturnOrders/SalesReturnOrdersTable.tsx | Edit | edit |
| apps/erp/app/modules/sales/ui/SalesRules/SalesRulesTable.tsx | Edit Rule | edit |
| apps/erp/app/modules/settings/ui/ApiKeys/ApiKeysTable.tsx | Edit API Key | edit |
| apps/erp/app/modules/settings/ui/Approvals/ApprovalRuleCard.ee.tsx | Edit Rule | edit |
| apps/erp/app/modules/settings/ui/CustomFields/CustomFieldsTable.tsx | View Custom Fields | view |
| apps/erp/app/modules/settings/ui/CustomFields/CustomFieldsTableDetail.tsx | Edit Custom Field | edit |
| apps/erp/app/modules/settings/ui/Printing/PrintJobsTable.tsx | View | view |
| apps/erp/app/modules/settings/ui/Sequences/SequencesTable.tsx | Edit Sequence | edit |
| apps/erp/app/modules/settings/ui/SerialNumbers/ItemSerialSequencesTable.tsx | Edit | edit |
| apps/erp/app/modules/settings/ui/Webhooks/WebhooksTable.tsx | Edit Webhook | edit |
| apps/erp/app/modules/users/ui/EmployeeTypes/EmployeeTypesTable.ee.tsx | Edit Employee Type | edit |
| apps/erp/app/modules/users/ui/EmployeeTypes/EmployeeTypesTable.ee.tsx | View Employees | view |
| apps/erp/app/modules/users/ui/Employees/EmployeesTable.tsx | Edit Permissions (bulk actions) | edit |
| apps/erp/app/modules/users/ui/Employees/EmployeesTable.tsx | Edit Permissions (row menu) | edit |
| apps/erp/app/modules/users/ui/Groups/GroupsTable.tsx | Edit Group | edit |
| apps/erp/app/modules/workflows/ui/WorkflowsTable.tsx | Open Workflow | open |
| apps/erp/app/modules/workflows/ui/WorkflowsTable.tsx | Rename Workflow | rename |
| apps/erp/app/routes/x+/fixed-asset+/$fixedAssetId.tsx | Edit | edit |
| apps/erp/app/routes/x+/person+/$personId.timecard.tsx | Edit | edit |
| apps/erp/app/routes/x+/resources+/assignments.tsx | Edit Assignment | edit |
| apps/erp/app/routes/x+/resources+/assignments.tsx | View Status | view |
| apps/mes/app/components/JobOperation/JobOperation.tsx | Download | download |
| apps/mes/app/components/JobOperation/JobOperation.tsx | Download | download |
| apps/mes/app/routes/x+/timecard.tsx | Edit | edit |
