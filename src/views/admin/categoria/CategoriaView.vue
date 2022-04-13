<template>
  <div class="card">
    <h1>Gestion de categorias</h1>
    <Button label="Crear categoria" icon="pi pi-external-link" @click="openNuevaCategoria" />
        <Dialog header="Nueva categoria" v-model:visible="dialog" :style="{width: '40vw'}">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeNuevaCategoria" class="p-button-text"/>
                <Button label="Yes" icon="pi pi-check" @click="closeNuevaCategoria" autofocus />
            </template>
        </Dialog>

    <DataTable :value="categorias" responsiveLayout="scroll">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column field="detalle" header="Detalle"></Column>
    </DataTable>
  </div>
</template>

<script>
import * as categoriaService from './../../../services/categoria.service'

export default {
  data() {
    return {
      categorias: null,
      dialog: false     
    }
  },
  async mounted() {
    const {data} = await categoriaService.listarCategorias();
    this.categorias = data
  },
  methods: {
    openNuevaCategoria() {
      this.dialog = true;
    },
    closeNuevaCategoria() {
      this.dialog = false;
    },
  }
}
</script>

<style>

</style>