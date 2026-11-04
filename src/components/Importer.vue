<template>
    <div class="pa-3" style="height: calc(100vh - 48px); overflow-y: auto">
        <v-btn color="secondary" :loading="reading" prepend-icon="mdi-magnify" @click="openFile()">Buscar</v-btn>

        <v-alert v-if="error || filterResult.error" type="error" class="mt-3" density="compact">{{ error || filterResult.error }}</v-alert>

        <template v-if="report">
            <div class="mt-3 text-subtitle-1"><v-icon start>mdi-file-excel-outline</v-icon>{{ report.listType }}</div>
            <div class="text-caption text-medium-emphasis">{{ file?.toString() }}</div>

            <v-menu v-model="pickerOpen" :close-on-content-click="false" location="bottom" min-width="auto">
                <template v-slot:activator="{ props }">
                    <v-text-field
                        :model-value="rangeText"
                        label="Rango de fechas (opcional)"
                        prepend-icon="mdi-calendar-range"
                        class="mt-4"
                        readonly
                        clearable
                        @click:clear="range = []"
                        v-bind="props"
                    />
                </template>
                <v-date-picker
                    v-model="range"
                    v-model:month="pickerMonth"
                    v-model:year="pickerYear"
                    multiple="range"
                    hide-header
                    first-day-of-week="1"
                />
            </v-menu>

            <v-chip size="small" :color="isFiltered ? 'primary' : undefined"> {{ filteredSales.length }} de {{ report.sales.length }} ventas </v-chip>

            <v-tabs v-model="previewTab" class="mt-2" grow>
                <v-tab :value="0">Resumen</v-tab>
                <v-tab :value="1">Ventas</v-tab>
            </v-tabs>
            <v-window v-model="previewTab">
                <v-window-item :value="0">
                    <v-data-table :headers="subtotalHeaders" :items="subtotals" v-bind="tableProps" />
                </v-window-item>
                <v-window-item :value="1">
                    <v-data-table :headers="saleHeaders" :items="filteredSales" v-bind="tableProps" />
                </v-window-item>
            </v-window>

            <v-btn class="mt-4" color="primary" :loading="exporting" :disabled="filteredSales.length == 0" prepend-icon="mdi-export" @click="exportFile()">
                Exportar
            </v-btn>
            <v-alert v-if="savedFile" type="success" class="mt-3" density="compact">Descargado: {{ savedFile }}</v-alert>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import File from "@/Domain/File";
    import Sale from "@/Domain/Sale";
    import SalesReport from "@/Domain/SalesReport";
    import DateRange from "@/Domain/DateRange";
    import ReadSalesFile from "@/Application/ReadSalesFile";
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
            report: undefined as SalesReport | undefined,
            /** v-date-picker fills a range with every day between the picked ones */
            range: [] as Date[],
            pickerOpen: false,
            pickerMonth: undefined as number | undefined,
            pickerYear: undefined as number | undefined,
            previewTab: 0,
            reading: false,
            exporting: false,
            savedFile: "",
            error: "",
            subtotalHeaders: [
                { title: "Producto", key: "itemName" },
                { title: "Cantidad", key: "ammount", align: "end" as const },
            ],
            saleHeaders: [
                { title: "Fecha", key: "date" },
                { title: "Máquina", key: "machine" },
                { title: "Línea", key: "line" },
                { title: "Producto", key: "item" },
            ],
            tableProps: {
                density: "compact" as const,
                fixedHeader: true,
                height: "calc(100vh - 470px)",
                itemsPerPage: -1,
                hideDefaultFooter: true,
            },
        }),
        computed: {
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
        },
        methods: {
            async openFile() {
                const file = await RequestFile();
                if (file == undefined) return;

                this.reading = true;
                this.reset();
                try {
                    this.report = await ReadSalesFile(repository, file);
                    this.file = file;
                    this.showFirstSaleMonth(this.report);
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
                this.report = undefined;
                this.range = [];
                this.savedFile = "";
                this.error = "";
            },
            showFirstSaleMonth(report: SalesReport) {
                if (report.sales.length == 0) return;
                try {
                    const date = report.sales[0].transactionDate();
                    this.pickerMonth = date.getMonth();
                    this.pickerYear = date.getFullYear();
                } catch (e) {
                    // Keep the picker on the current month
                }
            },
        },
    });
</script>
