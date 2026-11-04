<template>
    <div>
        <v-alert v-if="error || filterResult.error" type="error" class="mb-4" density="compact">{{ error || filterResult.error }}</v-alert>

        <v-row v-if="!sheet" justify="center">
            <v-col cols="12" md="8" lg="6">
                <v-card class="text-center pa-12">
                    <v-icon size="64" class="mb-4 text-medium-emphasis">mdi-file-excel-outline</v-icon>
                    <div class="text-h6">Import a file</div>
                    <div class="text-medium-emphasis mb-6">Choose an Excel file to filter its sales by date and export them</div>
                    <v-btn color="primary" size="large" :loading="reading" prepend-icon="mdi-magnify" @click="openFile()">Browse</v-btn>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-else>
            <v-col cols="12" md="5" lg="4">
                <v-card>
                    <v-card-item :title="sheet.listType" :subtitle="file?.toString()">
                        <template v-slot:prepend><v-icon size="large" color="primary">mdi-file-excel-outline</v-icon></template>
                        <template v-slot:append>
                            <v-btn variant="text" :loading="reading" prepend-icon="mdi-magnify" @click="openFile()">Change</v-btn>
                        </template>
                    </v-card-item>
                    <v-card-text>
                        <v-select
                            v-model="layout"
                            :items="layouts"
                            label="Layout"
                            prepend-inner-icon="mdi-format-list-bulleted"
                            :hint="layoutHint"
                            persistent-hint
                            :error-messages="layoutError"
                        />
                    </v-card-text>
                </v-card>

                <v-card class="mt-4">
                    <v-card-item title="Date range" subtitle="Optional: without a range all sales are exported">
                        <template v-slot:prepend><v-icon>mdi-calendar-range</v-icon></template>
                    </v-card-item>
                    <div class="d-flex justify-center">
                        <v-date-picker
                            v-model="range"
                            v-model:month="pickerMonth"
                            v-model:year="pickerYear"
                            multiple="range"
                            hide-header
                            first-day-of-week="1"
                            bg-color="transparent"
                        />
                    </div>
                    <v-card-actions class="px-4">
                        <span :class="isFiltered ? '' : 'text-medium-emphasis'">{{ rangeText || "All dates" }}</span>
                        <v-spacer />
                        <v-btn v-if="isFiltered" variant="text" prepend-icon="mdi-close" @click="range = []">Clear</v-btn>
                    </v-card-actions>
                </v-card>

                <v-btn
                    class="mt-4"
                    block
                    size="large"
                    color="primary"
                    :loading="exporting"
                    :disabled="filteredSales.length == 0"
                    prepend-icon="mdi-export"
                    @click="exportFile()"
                >
                    Export {{ filteredSales.length }} of {{ report?.sales.length ?? 0 }} sales
                </v-btn>
                <v-alert v-if="savedFile" type="success" class="mt-4" density="compact">Downloaded: {{ savedFile }}</v-alert>
            </v-col>

            <v-col cols="12" md="7" lg="8">
                <v-card v-if="!report" class="text-center text-medium-emphasis pa-12">
                    <v-icon size="64" class="mb-4">mdi-format-list-bulleted</v-icon>
                    <div>Choose a layout to preview the sales</div>
                </v-card>
                <v-card v-else>
                    <v-tabs v-model="previewTab">
                        <v-tab :value="0">Summary <v-chip class="ml-2" size="x-small">{{ subtotals.length }}</v-chip></v-tab>
                        <v-tab :value="1">
                            Sales <v-chip class="ml-2" size="x-small" :color="isFiltered ? 'primary' : undefined">{{ filteredSales.length }}</v-chip>
                        </v-tab>
                    </v-tabs>
                    <v-divider />
                    <v-window v-model="previewTab">
                        <v-window-item :value="0">
                            <v-data-table :headers="subtotalHeaders" :items="subtotals" v-bind="tableProps" />
                        </v-window-item>
                        <v-window-item :value="1">
                            <v-data-table :headers="saleHeaders" :items="filteredSales" v-bind="tableProps" />
                        </v-window-item>
                    </v-window>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import File from "@/Domain/File";
    import Sale from "@/Domain/Sale";
    import SalesReport from "@/Domain/SalesReport";
    import SalesSheet from "@/Domain/SalesSheet";
    import parseTransactionDate from "@/Domain/TransactionDate";
    import DateRange from "@/Domain/DateRange";
    import BuildSalesReport from "@/Application/BuildSalesReport";
    import { DetectLayout, LayoutNames } from "@/Application/SaleFinder";
    import FilterSalesByDateRange from "@/Application/FilterSalesByDateRange";
    import GetSalesSubtotal from "@/Application/GetSalesSubtotal";
    import ExportSalesReport from "@/Application/ExportSalesReport";
    import ExcelSalesFileRepository from "@/Infrastructure/ExcelSalesFileRepository";
    import RequestFile from "@/Infrastructure/RequestFile";

    const repository = new ExcelSalesFileRepository();

    function toDisplayDate(date: Date): string {
        return [date.getDate(), date.getMonth() + 1].map((n) => String(n).padStart(2, "0")).join("/") + "/" + date.getFullYear();
    }

    export default defineComponent({
        name: "Importer",
        data: () => ({
            file: undefined as File | undefined,
            sheet: undefined as SalesSheet | undefined,
            layouts: LayoutNames(),
            layout: undefined as string | undefined,
            detectedLayout: undefined as string | undefined,
            /** v-date-picker fills a range with every day between the picked ones */
            range: [] as Date[],
            pickerMonth: undefined as number | undefined,
            pickerYear: undefined as number | undefined,
            previewTab: 0,
            reading: false,
            exporting: false,
            savedFile: "",
            error: "",
            subtotalHeaders: [
                { title: "Product", key: "itemName" },
                { title: "Quantity", key: "ammount", align: "end" as const },
            ],
            saleHeaders: [
                { title: "Date", key: "date" },
                { title: "Machine", key: "machine" },
                { title: "Line", key: "line" },
                { title: "Product", key: "item" },
            ],
            tableProps: {
                density: "compact" as const,
                fixedHeader: true,
                height: "calc(100vh - 170px)",
                itemsPerPage: -1,
                hideDefaultFooter: true,
            },
        }),
        computed: {
            reportResult(): { report?: SalesReport; error: string } {
                if (this.sheet == undefined || this.layout == undefined) return { error: "" };
                try {
                    return { report: BuildSalesReport(this.sheet, this.layout), error: "" };
                } catch (e) {
                    return { error: String(e) };
                }
            },
            report(): SalesReport | undefined {
                return this.reportResult.report;
            },
            layoutHint(): string {
                if (this.layout == undefined) return "";
                return this.layout == this.detectedLayout ? "Detected from the file" : "Chosen manually";
            },
            layoutError(): string {
                if (this.reportResult.error) return this.reportResult.error;
                if (this.layout == undefined) return "The layout could not be detected, choose one";
                return "";
            },
            rangeEnds(): Date[] {
                if (this.range.length == 0) return [];
                const times = this.range.map((date) => date.getTime());
                const [from, to] = [Math.min(...times), Math.max(...times)];
                return from == to ? [new Date(from)] : [new Date(from), new Date(to)];
            },
            dateRange(): DateRange {
                const [from, to] = this.rangeEnds;
                return DateRange.between(from, to);
            },
            isFiltered(): boolean {
                return this.dateRange.isBounded();
            },
            rangeText(): string {
                return this.rangeEnds.map(toDisplayDate).join(" – ");
            },
            filterResult(): { sales: Sale[]; error: string } {
                if (this.report == undefined) return { sales: [], error: "" };
                try {
                    return { sales: FilterSalesByDateRange(this.report.sales, this.dateRange), error: "" };
                } catch (e) {
                    return { sales: [], error: String(e) };
                }
            },
            filteredSales(): Sale[] {
                return this.filterResult.sales;
            },
            subtotals(): ReturnType<typeof GetSalesSubtotal> {
                return GetSalesSubtotal(this.filteredSales);
            },
        },
        watch: {
            dateRange() {
                this.savedFile = "";
            },
            layout() {
                this.savedFile = "";
            },
        },
        methods: {
            async openFile() {
                const file = await RequestFile();
                if (file == undefined) return;

                this.reading = true;
                this.reset();
                try {
                    this.sheet = await repository.read(file);
                    this.file = file;
                    this.detectedLayout = DetectLayout(this.sheet.listType);
                    this.layout = this.detectedLayout;
                    this.showFirstSaleMonth(this.sheet);
                } catch (e) {
                    this.error = String(e);
                } finally {
                    this.reading = false;
                }
            },
            async exportFile() {
                if (this.file == undefined || this.report == undefined) return;

                this.exporting = true;
                this.error = "";
                try {
                    this.savedFile = await ExportSalesReport(repository, this.file, {
                        listType: this.report.listType,
                        sales: this.filteredSales,
                    });
                } catch (e) {
                    this.error = String(e);
                } finally {
                    this.exporting = false;
                }
            },
            reset() {
                this.file = undefined;
                this.sheet = undefined;
                this.layout = undefined;
                this.detectedLayout = undefined;
                this.range = [];
                this.savedFile = "";
                this.error = "";
            },
            showFirstSaleMonth(sheet: SalesSheet) {
                if (sheet.records.length == 0) return;
                try {
                    const date = parseTransactionDate(sheet.records[0].date);
                    this.pickerMonth = date.getMonth();
                    this.pickerYear = date.getFullYear();
                } catch (e) {
                    // Keep the picker on the current month
                }
            },
        },
    });
</script>
