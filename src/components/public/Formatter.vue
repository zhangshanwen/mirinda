<template>

</template>

<script>

    export default {
        name: 'Formatter',
        methods: {
            formatterTime(row, column, cellValue, index) {
                if (cellValue > 0) {
                    const newDate = new Date();
                    newDate.setTime(cellValue * 1000);
                    return newDate.toLocaleString();
                } else {
                    return '-';
                }
            },
            formatterDate(row, column, cellValue, index) {
                if (cellValue > 0) {
                    const newDate = new Date();
                    newDate.setTime(cellValue * 1000);
                    return newDate.toLocaleDateString();
                } else {
                    return '-';
                }
            }
        }
    };
</script>

<style scoped>

</style>
