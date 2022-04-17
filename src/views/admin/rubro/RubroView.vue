<template>
    <div class="card">
      <h1>Gestion Rubros</h1>
      <Toast />
      <ConfirmDialog></ConfirmDialog>
        <Button label="Crear Rubro" icon="pi pi-external-link" @click="openNuevoRubro" />
        <Dialog header="Nuevo Rubro" v-model:visible="dialog" :style="{width: '40vw'}">            
            <div class="p-fluid grid">
                <div class="field col-12 md:col-12">
                    <span class="p-float-label">
                        <InputText id="inputtext" type="text" v-model="rubro.nombre" />
                        <label for="inputtext">Nombre</label>
                    </span>
                </div>
                <div class="field col-12 md:col-12">
                    <span class="p-float-label">
                        <InputText id="inputtext" type="text" v-model="rubro.detalle" />
                        <label for="inputtext">Detalle</label>
                    </span>
                </div>
                <div class="field col-12 md:col-12">
                    <span class="p-float-label">
                        <InputText id="inputtext" type="text" v-model="rubro.estado" />
                        <label for="inputtext">Estado</label>
                    </span>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" @click="closeNuevoRubro" class="p-button-text"/>
                <Button label="Guardar" icon="pi pi-check" @click="guardarNuevoRubro" autofocus />
            </template>
        </Dialog>
        <div style="text-align:center">
          <ProgressSpinner v-if="cargando" style="width:50px;height:50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
        </div>
        <DataTable :value="rubros" responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="detalle" header="Detalle"></Column>
            <Column field="estado" header="Estado"></Column>
            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRubro(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import * as rubroService from './../../../services/rubro.service'

export default {
  data() {
    return {
      rubros: null,
      dialog: false,
      rubro: {
        nombre: '',
        detalle: '',
        estado: ''
      },
      estadoEdicion: false,
      cargando: true
    }
  },
  mounted() {    
    this.listaRubro()
  },
  methods: {
    async listaRubro() {
      this.cargando = true;    
      const { data } = await rubroService.listarRubros();
      this.rubros = data;
      this.cargando = false;
    },
    openNuevoRubro() {
      this.dialog = true;
    },
    closeNuevoRubro() {
      this.dialog = false;
    },
    async guardarNuevoRubro() {
      this.cargando = true;
      let datos;  
      if (this.estadoEdicion) {
        datos = await rubroService.modificarRubros(this.rubro.id, this.rubro);
      }
      else {
        datos = await rubroService.guardarRubros(this.rubro);
      }
      if (!datos.data.error) {
        this.listaRubro();
        this.closeNuevoRubro();
        this.estadoEdicion = false;
        this.rubro = {
          nombre: '',
          detalle: '',
          estado: ''        
        };        
      }
    },
    editRubro(data) {
      this.estadoEdicion = true
      this.rubro = data
      this.openNuevoRubro()
    },
    confirmDeleteProduct(data) {
      this.cargando = true;
      this.$confirm.require({
        message: 'Esta seguro que desea eliminar '+data.nombre,
        header: 'Eliminar',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
          await rubroService.eliminarRubros(data.id);
          this.listaRubro();
          this.$toast.add({severity:'info', summary:'Eliminado ', detail:'Aceptaste Eliminar', life: 3000});
        },
        reject: () => {
          this.$toast.add({severity:'error', summary:'Cancelado', detail:'Aceptaste Cancelar', life: 3000});
        }
      });
      this.cargando = true;
    }
  },
}
</script>

<style>

</style>