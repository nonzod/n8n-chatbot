<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'select', province: string): void;
}>();

const selectedProvince = ref<string>('');

// Lista delle province italiane
const provinces = [
  'Agrigento', 'Alessandria', 'Ancona', 'Arezzo', 'Ascoli Piceno', 'Asti', 'Avellino', 'Bari', 'Barletta-Andria-Trani', 'Belluno',
  'Benevento', 'Bergamo', 'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari', 'Caltanissetta', 'Campobasso',
  'Caserta', 'Catania', 'Catanzaro', 'Chieti', 'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna',
  'Fermo', 'Ferrara', 'Firenze', 'Foggia', 'Forlì-Cesena', 'Frosinone', 'Genova', 'Gorizia', 'Grosseto', 'Imperia',
  'Isernia', 'La Spezia', 'L\'Aquila', 'Latina', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata',
  'Mantova', 'Massa-Carrara', 'Matera', 'Messina', 'Milano', 'Modena', 'Monza e Brianza', 'Napoli', 'Novara', 'Nuoro',
  'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia', 'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa',
  'Pistoia', 'Pordenone', 'Potenza', 'Prato', 'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia', 'Rieti', 'Rimini',
  'Roma', 'Rovigo', 'Salerno', 'Sassari', 'Savona', 'Siena', 'Siracusa', 'Sondrio', 'Sud Sardegna', 'Taranto',
  'Teramo', 'Terni', 'Torino', 'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia',
  'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'
];

function handleConfirm() {
  if (selectedProvince.value) {
    emit('select', selectedProvince.value);
  }
}
</script>

<template>
  <div class="tt-chat-province">
    <div class="tt-chat-province-message">
      Seleziona la tua provincia:
    </div>
    
    <div class="tt-chat-province-select">
      <select v-model="selectedProvince" class="tt-chat-province-dropdown">
        <option value="">Seleziona una provincia...</option>
        <option v-for="province in provinces" :key="province" :value="province">
          {{ province }}
        </option>
      </select>
    </div>
    
    <button 
      class="tt-chat-province-button" 
      @click="handleConfirm" 
      :disabled="!selectedProvince"
    >
      Conferma selezione
    </button>
  </div>
</template>

<style lang="scss">
.tt-chat-province {
  display: flex;
  flex-direction: column;
  padding: 15px;
  
  &-message {
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--tt-chat-primary-color);
  }
  
  &-select {
    margin-bottom: 15px;
  }
  
  &-dropdown {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    
    &:focus {
      outline: none;
      border-color: var(--tt-chat-primary-color);
    }
  }
  
  &-button {
    align-self: flex-start;
    background-color: var(--tt-chat-primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>