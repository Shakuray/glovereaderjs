<template>
    <div class="pa-3" style="height: calc(100vh - 48px); overflow-y: auto">
        <v-btn color="secondary" :loading="reading" @click="openFile()"> <v-icon left>mdi-magnify</v-icon> Buscar </v-btn>

        <v-alert v-if="error || filterResult.error" type="error" class="mt-3" dense>{{ error || filterResult.error }}</v-alert>

        <template v-if="report">
            <div class="mt-3 text-subtitle-1"><v-icon left>mdi-file-excel-outline</v-icon>{{ report.listType }}</div>
            <div class="text-caption text--secondary">{{ file.toString() }}</div>

            <v-menu v-model="pickerOpen" :close-on-content-click="false" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        :value="rangeText"
                        label="Rango de fechas (opcional)"
                        prepend-icon="mdi-calendar-range"
                        class="mt-4"
                        readonly
                        clearable
                        @click:clear="range = []"
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-date-picker v-model="range" :picker-date.sync="pickerMonth" range no-title locale="es-ES" first-day-of-week="1" />
            </v-menu>

            <v-chip small :color="isFiltered ? 'primary' : undefined"> {{ filteredSales.length }} de {{ report.sales.length }} ventas </v-chip>

            <v-tabs v-model="previewTab" class="mt-2" grow>
                <v-tab>Resumen</v-tab>
                <v-tab>Ventas</v-tab>
            </v-tabs>
            <v-tabs-items v-model="previewTab">
                <v-tab-item>
                    <v-data-table :headers="subtotalHeaders" :items="subtotals" v-bind="tableProps" />
                </v-tab-item>
                <v-tab-item>
                    <v-data-table :headers="saleHeaders" :items="filteredSales" v-bind="tableProps" />
                </v-tab-item>
            </v-tabs-items>

            <v-btn class="mt-4" color="primary" :loading="exporting" :disabled="filteredSales.length == 0" @click="exportFile()">
                <v-icon left>mdi-export</v-icon> Exportar
            </v-btn>
            <v-alert v-if="savedPath" type="success" class="mt-3" dense>{{ savedPath }}</v-alert>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
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

    /** Converts the "yyyy-mm-dd" values used by v-date-picker to local dates */
    function fromPickerDate(value: string): Date {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    function toDisplayDate(value: string): string {
        return value.split("-").reverse().join("/");
    }

    export default Vue.extend({
        name: "Importer",
        data: () => ({
            file: undefined as File | undefined,
            report: undefined as SalesReport | undefined,
            range: [] as string[],
            pickerOpen: false,
            pickerMonth: undefined as string | undefined,
            previewTab: 0,
            reading: false,
            exporting: false,
            savedPath: "",
            error: "",
            subtotalHeaders: [
                { text: "Producto", value: "itemName" },
                { text: "Cantidad", value: "ammount", align: "end" },
            ],
            saleHeaders: [
                { text: "Fecha", value: "date" },
                { text: "Máquina", value: "machine" },
                { text: "Línea", value: "line" },
                { text: "Producto", value: "item" },
            ],
            tableProps: {
                dense: true,
                fixedHeader: true,
                height: "calc(100vh - 470px)",
                disablePagination: true,
                hideDefaultFooter: true,
            },
        }),
        computed: {
            sortedRange(): string[] {
                return [...this.range].sort();
            },
            dateRange(): DateRange {
                const [from, to] = this.sortedRange.map(fromPickerDate);
                return DateRange.between(from, to);
            },
            isFiltered(): boolean {
                return this.dateRange.isBounded();
            },
            rangeText(): string {
                return this.sortedRange.map(toDisplayDate).join(" – ");
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
                this.savedPath = "";
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
                    this.pickerMonth = this.firstSaleMonth(this.report);
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
                    this.savedPath = await ExportSalesReport(repository, this.file, {
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
                this.savedPath = "";
                this.error = "";
            },
            firstSaleMonth(report: SalesReport): string | undefined {
                if (report.sales.length == 0) return undefined;
                try {
                    const date = report.sales[0].transactionDate();
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                } catch (e) {
                    return undefined;
                }
            },
        },
    });
</script>
