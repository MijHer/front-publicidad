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
            <Dropdown id="inventoryStatus" v-model="publicacion.nivel" :options="niveles" optionLabel="Nivel" placeholder="Seleciona el nivel">
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
            <label for="inventoryStatus" class="mb-3">categoria</label>
            <Dropdown id="inventoryStatus" v-model="publicacion.categoria_id" :options="niveles" optionLabel="Nivel" placeholder="Seleciona el nivel">
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
        </div>

        <div class="field">
            <label for="descripcion">Descripcion</label>
            <Textarea id="descripcion" v-model="publicacion.descripcion" required="false" rows="3" cols="20" />
        </div>
        <div class="field">
            <label for="requerimientos">Requerimientos</label>
            <Textarea id="requerimientos" v-model="publicacion.requerimientos" required="false" rows="3" cols="20" />
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
      </div>
      <template #footer>
          <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
      </template>
    </Dialog>

  </div>
</div>
{{publicaciones}}
</template>

<script>
import * as publicacionService from '../../../services/publicacion.service'

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
      ]
    }
  },
  mounted() {
    this.listaPublicaciones();
  },
  methods: {
    async listaPublicaciones() {
      const { data } = await publicacionService.listarPublicaciones();
      this.publicaciones = data;      
    },
    abrirDialog() {
      this.publicacion = {};
      this.submitted = false;
      this.publicacionDialog = true;
    }
  },
}
</script>

<style>

</style>