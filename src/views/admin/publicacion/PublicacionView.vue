<template>
<div>
  <div class="card">
    <Toast />
      <ConfirmDialog></ConfirmDialog>
    <Toolbar class="mb-4">
      <template #start>
          <Button label="Nueva Publicacion" icon="pi pi-plus" class="p-button-success mr-2" @click="abrirDialog" />
          <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
      </template>
      <template #end>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Import" class="mr-2 inline-block" />
          <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="publicaciones" v-model:selection="selectedPublicaciones" dataKey="id" 
        :paginator="true" :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
        <template #header>
            <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
              <h5 class="mb-2 md:m-0 p-as-md-center">Gestion de publicaciones</h5>
              <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Search..." />
              </span>
            </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="titulo" header="Nombre" :sortable="true" style="min-width:16rem"></Column>
        <Column field="tipo" header="Tiempo" :sortable="true" style="min-width:16rem"></Column>

        <Column field="nivel" header="Nivel" :sortable="true" style="min-width:16rem"></Column>
        <Column field="descripcion" header="Descripcion" :sortable="true" style="min-width:16rem"></Column>
        <Column field="requerimientos" header="Requerimientos" :sortable="true" style="min-width:16rem"></Column>
        <Column field="salario" header="Sueldo" :sortable="true" style="min-width:16rem"></Column>
        <Column field="ubicacion" header="Lugar" :sortable="true" style="min-width:16rem"></Column>
        <Column field="empresa.nombre" header="Empresa" :sortable="true" style="min-width:16rem"></Column>
        <Column field="categoria.nombre" header="Categoria" :sortable="true" style="min-width:16rem"></Column>
        <!-- <Column field="persona_id" header="responsable" :sortable="true" style="min-width:16rem"></Column>        -->
        <Column :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editPublicacion(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeletePublicacion(slotProps.data)" />
          </template>
        </Column>    
    </DataTable>

    <Dialog v-model:visible="publicacionDialog" :style="{width: '650px'}" header="Nueva Publicacion" :modal="true" class="p-fluid">
        <!-- <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="product.image" class="product-image" v-if="product.image" /> -->
        <div class="field">
            <label for="titulo">Titulo</label>
            <InputText id="titulo" v-model.trim="publicacion.titulo" required="true" autofocus :class="{'p-invalid': submitted && !publicacion.titulo}" />
            <small class="p-error" v-if="submitted && !publicacion.titulo">Titulo es requerido.</small>
        </div>
        <div class="field">
          <label class="mb-3">Tipo</label>
          <div class="formgrid grid">
              <div class="field-radiobutton col-6">
                  <RadioButton id="publi1" name="tipo" value="tiempo completo" v-model="publicacion.tipo" />
                  <label for="publi1">Tiempo completo</label>
              </div>
              <div class="field-radiobutton col-6">
                  <RadioButton id="publi2" name="tipo" value="medio tiempo" v-model="publicacion.tipo" />
                  <label for="publi2">Medio tiempo</label>
              </div>
              <div class="field-radiobutton col-6">
                  <RadioButton id="publi3" name="tipo" value="temporal" v-model="publicacion.tipo" />
                  <label for="publi3">Temporal</label>
              </div>
              <div class="field-radiobutton col-6">
                  <RadioButton id="publi4" name="tipo" value="practicante" v-model="publicacion.tipo" />
                  <label for="publi4">Practicante</label>
              </div>
            </div>
        </div>
        <div class="formgrid grid"> 
          <div class="field col">
            <label for="inventoryStatus" class="mb-3">Nivel</label>
            <Dropdown id="inventoryStatus" v-model="publicacion.nivel" :options="niveles" optionLabel="label" optionValue="value" placeholder="Seleciona el nivel">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' +slotProps.value.toLowerCase()">{{slotProps.value}}</span>
                </div>
                <span v-else>
                  {{slotProps.placeholder}}
                </span>
              </template>
            </Dropdown>
          </div>
          <div class="field col">
            <label for="inventoryStatus" class="mb-3">Categoria</label>
            <Dropdown id="inventoryStatus" v-model="publicacion.categoria_id" :options="categorias" optionLabel="nombre" optionValue="id" placeholder="Seleciona la categoria">              
            </Dropdown>         
          </div>
        </div>
        <div class="formgrid grid">
          <div class="field col">
            <label for="inventoryStatus" class="mb-3">Empresa</label>
            <Dropdown id="inventoryStatus" v-model="publicacion.empresa_id" :options="empresas" optionLabel="nombre" optionValue="id" placeholder="Seleciona la categoria">              
            </Dropdown>         
          </div>
          <div class="field col">
            <label for="inventoryStatus" class="mb-3">Responsable</label>
            <Dropdown id="inventoryStatus" v-model="publicacion.persona_id" :options="personas" optionLabel="nombres" optionValue="id" placeholder="Responsable de publicacion">              
            </Dropdown>         
          </div>
        </div>
        <div class="field">
            <label for="descripcion">Descripcion</label>
            <Textarea id="descripcion" v-model="publicacion.descripcion" required="false" rows="2" cols="20" />
        </div>
        <div class="field">
            <label for="requerimientos">Requerimientos</label>
            <Textarea id="requerimientos" v-model="publicacion.requerimientos" required="false" rows="2" cols="20" />
        </div>
      <div class="formgrid grid">
          <div class="field col">
              <label for="salario">Salario</label>
              <InputNumber id="salario" v-model="publicacion.salario" mode="currency" currency="USD" locale="en-US" />
          </div>
          <div class="field col">
              <label for="ubicacion">Ubicacion</label>
              <InputText id="ubicacion" v-model.trim="publicacion.ubicacion" required="true" autofocus :class="{'p-invalid': submitted && !publicacion.ubicacion}" />
              <small class="p-error" v-if="submitted && !publicacion.ubicacion">Ubicacion es requerido.</small>
          </div>
          <div class="field col">
              <label for="estado">Estado</label>
              <InputText id="estado" v-model.trim="publicacion.estado" required="true" autofocus :class="{'p-invalid': submitted && !publicacion.ubicacion}" />
              <small class="p-error" v-if="submitted && !publicacion.ubicacion">Estado es requerido.</small>
          </div>
      </div>
      <template #footer>
          <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialog"/>
          <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarPublicacion" />
      </template>      
    </Dialog>
  </div>
  {{publicaciones}}
</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import * as publicacionService from '../../../services/publicacion.service';
import * as categoriaService from '../../../services/categoria.service';
import * as empresaService from '../../../services/empresa.service';
import * as personaService from '../../../services/persona.service';

export default {
  data() {
    return {
      publicaciones: null,
      publicacionDialog: false,
      publicacion: {},
      selectedPublicaciones: null,
      filters:{},
      submitted: false,
      niveles: [
				{label: 'JUNIOR', value: 'junior'},
				{label: 'SENIOR', value: 'senior'},
				{label: 'MANAGER', value: 'manager'}
      ],
      categorias: {},
      empresas: {},
      personas: {},
      estadoEdicion: false
    }    
  },   
  created() {     
    this.initFilters();
  },
  mounted() {
    this.listaPublicaciones();
    
  },
  methods: {
    async listaPublicaciones() {
      const { data } = await publicacionService.listarPublicaciones();
      this.publicaciones = data.data;
      const cat = await categoriaService.listarCategorias();
      this.categorias = cat.data;
      const emp = await empresaService.listarEmpresas();
      this.empresas = emp.data;
      const per = await personaService.listarPersonas();
      this.personas = per.data;
      
    },
    abrirDialog() {
      this.publicacion = {};
      this.submitted = false;
      this.publicacionDialog = true;
    },
    cerrarDialog() {
      this.publicacionDialog = false;
      this.submitted = false;
    },
    async guardarPublicacion() {
      let datos;
      if (this.estadoEdicion) {
        datos = await publicacionService.modificarPublicaciones(this.publicacion.id, this.publicacion);
        this.publicacion = datos;
      } else {
        datos = await publicacionService.guardarPublicaciones(this.publicacion);
        this.publicacion = datos;
      }
      this.cerrarDialog();
      this.listaPublicaciones();
      
    },
    editPublicacion(data) {
      this.publicacion = data;           
      this.estadoEdicion = true;      
      this.publicacionDialog = true;
    },
    confirmDeletePublicacion(data) {
      this.$confirm.require({
        message: 'Esta seguro que desea eliminar ',
        header: 'Eliminar',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
          data = await publicacionService.eliminarPublicaciones(data.id)
          this.$toast.add({severity:'info', summary:'Eliminado', detail:'Aceptaste Eliminar', life: 3000});
          this.listaPublicaciones();
        },
        reject: () => {
          this.$toast.add({severity:'error', summary:'Cancelado', detail:'Aceptaste Cancelar', life: 3000});
        }      
      });
    },
    /* confirmDeletePublicacion(data) {
      this.publicacion = publicacionService.eliminarPublicaciones(data.id);
      this.listaPublicaciones();
    }, */
    initFilters() {
      this.filters = {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      }
    }
  },
}
</script>

<style>

</style>