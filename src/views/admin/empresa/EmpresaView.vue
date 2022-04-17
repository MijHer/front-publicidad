<template>
  <div class="card">
    <h1>Gestion De Empresas</h1>
    <Toast />
      <ConfirmDialog></ConfirmDialog>
    <Button label="Crear Empresa" icon="pi pi-external-link" @click="openNuevaEmpresa" />
    <Dialog header="Nueva empresa" v-model:visible="dialog" :style="{width: '40vw'}">
        <div class="p-fluid grid">
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.nombre" />
                  <label for="inputtext">Nombre</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.sitio_web" />
                  <label for="inputtext">Pagina Web</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.direccion" />
                  <label for="inputtext">Direccion</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.ciudad" />
                  <label for="inputtext">Ciudad</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.pais" />
                  <label for="inputtext">Pais</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.descripcion" />
                  <label for="inputtext">Descripcion</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.telefono" />
                  <label for="inputtext">Telefono</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.nombre_contacto" />
                  <label for="inputtext">Contacto</label>
              </span>
          </div>
          <div class="field col-12 md:col-12">
              <span class="p-float-label">
                  <InputText id="inputtext" type="text" v-model="empresa.logo" />
                  <label for="inputtext">Logo</label>
              </span>
          </div>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="closeNuevaEmpresa" class="p-button-text"/>
            <Button label="Guardar" icon="pi pi-check" @click="guardarNuevaEmpresa" autofocus />
        </template>
    </Dialog>
    <DataTable :value="empresas" responsiveLayout="scroll">
        <Column field="nombre" header="Nombre"></Column>
        <Column field="sitio_web" header="PAGINA WEB"></Column>
        <Column field="direccion" header="DIRECCION"></Column>
        <Column field="ciudad" header="CIUDAD"></Column>
        <Column field="pais" header="PAIS"></Column>
        <Column field="descripcion" header="DESCRIPCION"></Column>
        <Column field="telefono" header="TELEFONO"></Column>
        <Column field="nombre_contacto" header="CONTACTO"></Column>
        <Column field="logo" header="LOGO"></Column>
        <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editEmpresa(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteEmpresa(slotProps.data)" />
            </template>
        </Column>       
    </DataTable>
  </div>
</template>

<script>
import * as empresaService from '../../../services/empresa.service'

export default {
  data() {
    return {
      empresas: null,
      dialog: false,
      empresa: {},
      estadoEdicion: false
    }
  },
  mounted() {
    this.listaEmpresa();
  },
  methods: {
    async listaEmpresa() {
      const { data } = await empresaService.listarEmpresas();
      this.empresas = data;
    },
    openNuevaEmpresa() {
      this.dialog = true;
    },
    closeNuevaEmpresa() {
      this.empresa = {};
      this.dialog = false;
    },
    async guardarNuevaEmpresa() {
      let datos;
      if (this.estadoEdicion) {
        datos = await empresaService.modificarEmpresas(this.empresa.id, this.empresa);
        this.empresa = datos;
      }
      else {
        
        datos = await empresaService.guardarEmpresas(this.empresa);
        this.empresa = datos;
      } 
      if (!datos.data.error) {
        this.listaEmpresa();
        this.closeNuevaEmpresa();
        this.estadoEdicion = false;
        this.empresa = {};
      }
    },
    editEmpresa(data) {
      this.estadoEdicion = true;
      this.empresa = data;
      this.openNuevaEmpresa();      
    },
    confirmDeleteEmpresa(data) {
      this.$confirm.require({
        message: 'Esta seguro que desea eliminar '+data.nombre,
        header: 'Eliminar',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
          data = await empresaService.eliminarEmpresas(data.id)
          this.$toast.add({severity:'info', summary:'Eliminado', detail:'Aceptaste Eliminar', life: 3000});
          this.listaEmpresa();
        },
        reject: () => {
          this.$toast.add({severity:'error', summary:'Cancelado', detail:'Aceptaste Cancelar', life: 3000});
        }      
      });
    }   
  },
}
</script>

<style>

</style>