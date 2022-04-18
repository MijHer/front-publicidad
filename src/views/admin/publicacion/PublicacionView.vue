<template>
<div>
  <div class="card">
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
          {{publicacion}}          
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
      submitted: false,
      niveles: [
				{label: 'JUNIOR', value: 'junior'},
				{label: 'SENIOR', value: 'senior'},
				{label: 'MANAGER', value: 'manager'}
      ],
      categorias: {},
      empresas: {},
      personas: {}
    }
  },
  mounted() {
    this.listaPublicaciones();
  },
  methods: {
    async listaPublicaciones() {
      const { data } = await publicacionService.listarPublicaciones();
      this.publicaciones = data;
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
      const {data} = await publicacionService.guardarPublicaciones(this.publicacion);
      this.publicacion = data;
    }
  },
}
</script>

<style>

</style>