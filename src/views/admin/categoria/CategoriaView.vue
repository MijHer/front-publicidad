<template>
  <div class="card">
    <h1>Gestion de categorias</h1>
    <Toast />
      <ConfirmDialog></ConfirmDialog>
    <Button label="Crear categoria" icon="pi pi-external-link" @click="openNuevaCategoria" />
        <Dialog header="Nueva categoria" v-model:visible="dialog" :style="{width: '40vw'}">
          <div class="p-fluid grid">  
            <div class="field col-12 md:col-12">
                <span class="p-float-label">
                    <InputText id="inputtext" type="text" v-model="categoria.nombre" />
                    <label for="inputtext">Nombre</label>
                </span>                
            </div>
            <div class="field col-12 md:col-12">
                <span class="p-float-label">
                    <InputText id="inputtext" type="text" v-model="categoria.detalle" />
                    <label for="inputtext">Detalle</label>
                </span>                
            </div>
          </div>          
          <template #footer>
              <Button label="Cancelar" icon="pi pi-times" @click="closeNuevaCategoria" class="p-button-text"/>
              <Button label="Guardar" icon="pi pi-check" @click="guardarNuevaCategoria()" autofocus />
          </template>          
        </Dialog>
        <div style="text-align:center">
          <ProgressSpinner v-if="cargando" style="width:50px;height:50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
        </div>
    <DataTable :value="categorias" responsiveLayout="scroll">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column field="detalle" header="Detalle"></Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editCategoria(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteCategoria(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
  </div>
</template>

<script>
import * as categoriaService from './../../../services/categoria.service'

export default {
  data() {
    return {
      categorias: null,
      dialog: false,
      categoria: {
        nombre: '',
        detalle: ''
      },
      estado: false,
      cargando: true
    }
  },
  mounted() {
    this.listaCategoria()
  },
  methods: {
    async listaCategoria() {
      this.cargando = true;
      const {data} = await categoriaService.listarCategorias();
      this.categorias = data;
      this.cargando = false;
    },
    openNuevaCategoria() {
      this.dialog = true;
    },
    closeNuevaCategoria() {
      this.dialog = false;
    },
    async guardarNuevaCategoria() {
      this.cargando = true;
      let datos;
      if (this.estado) {
        datos = await categoriaService.modificarCategorias(this.categoria.id, this.categoria);
      }
      else {
        datos = await categoriaService.guardarCategorias(this.categoria);
      }

      if(!datos.data.error) {
        this.listaCategoria();
        this.closeNuevaCategoria();
        this.estado = false;
        this.categoria = {
          nombre: '',
          detalle: ''
        };
      }
    },   
    editCategoria(data) {
      this.estado = true     
      this.categoria = data
      this.openNuevaCategoria()
    },
    confirmDeleteCategoria(data) { 
      this.cargando = true;     
      this.$confirm.require({
          message: 'Esta seguro de eliminar la categoria',
          header: 'Eliminar',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
              await categoriaService.eliminarCategorias(data.id);
              this.listaCategoria();
              this.$toast.add({severity:'info', summary:'Eliminado', detail:'Aceptaste Eliminar', life: 3000});
          },
          reject: () => {
              this.$toast.add({severity:'error', summary:'Cancelado', detail:'Cancelaste Eliminar', life: 3000});
          }
      });
      this.cargando = false;
    }
  }
}
</script>

<style>

</style>