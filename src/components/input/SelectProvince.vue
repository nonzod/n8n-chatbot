<script setup lang="ts">
import { ref } from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const emit = defineEmits<{
    (e: 'select', province: string): void;
}>();

const selectedProvince = ref<string>('');

const provinces = [
  {code: 'AG', province: 'Agrigento'},
  {code: 'AL', province: 'Alessandria'},
  {code: 'AN', province: 'Ancona'},
  {code: 'AR', province: 'Arezzo'},
  {code: 'AP', province: 'Ascoli Piceno'},
  {code: 'AT', province: 'Asti'},
  {code: 'AV', province: 'Avellino'},
  {code: 'BA', province: 'Bari'},
  {code: 'BT', province: 'Barletta-Andria-Trani'},
  {code: 'BL', province: 'Belluno'},
  {code: 'BN', province: 'Benevento'},
  {code: 'BG', province: 'Bergamo'},
  {code: 'BI', province: 'Biella'},
  {code: 'BO', province: 'Bologna'},
  {code: 'BZ', province: 'Bolzano'},
  {code: 'BS', province: 'Brescia'},
  {code: 'BR', province: 'Brindisi'},
  {code: 'CA', province: 'Cagliari'},
  {code: 'CL', province: 'Caltanissetta'},
  {code: 'CB', province: 'Campobasso'},
  {code: 'CE', province: 'Caserta'},
  {code: 'CT', province: 'Catania'},
  {code: 'CZ', province: 'Catanzaro'},
  {code: 'CH', province: 'Chieti'},
  {code: 'CO', province: 'Como'},
  {code: 'CS', province: 'Cosenza'},
  {code: 'CR', province: 'Cremona'},
  {code: 'KR', province: 'Crotone'},
  {code: 'CN', province: 'Cuneo'},
  {code: 'EN', province: 'Enna'},
  {code: 'FM', province: 'Fermo'},
  {code: 'FE', province: 'Ferrara'},
  {code: 'FI', province: 'Firenze'},
  {code: 'FG', province: 'Foggia'},
  {code: 'FC', province: 'Forlì-Cesena'},
  {code: 'FR', province: 'Frosinone'},
  {code: 'GE', province: 'Genova'},
  {code: 'GO', province: 'Gorizia'},
  {code: 'GR', province: 'Grosseto'},
  {code: 'IM', province: 'Imperia'},
  {code: 'IS', province: 'Isernia'},
  {code: 'SP', province: 'La Spezia'},
  {code: 'AQ', province: 'L\'Aquila'},
  {code: 'LT', province: 'Latina'},
  {code: 'LE', province: 'Lecce'},
  {code: 'LC', province: 'Lecco'},
  {code: 'LI', province: 'Livorno'},
  {code: 'LO', province: 'Lodi'},
  {code: 'LU', province: 'Lucca'},
  {code: 'MC', province: 'Macerata'},
  {code: 'MN', province: 'Mantova'},
  {code: 'MS', province: 'Massa-Carrara'},
  {code: 'MT', province: 'Matera'},
  {code: 'ME', province: 'Messina'},
  {code: 'MI', province: 'Milano'},
  {code: 'MO', province: 'Modena'},
  {code: 'MB', province: 'Monza e Brianza'},
  {code: 'NA', province: 'Napoli'},
  {code: 'NO', province: 'Novara'},
  {code: 'NU', province: 'Nuoro'},
  {code: 'OR', province: 'Oristano'},
  {code: 'PD', province: 'Padova'},
  {code: 'PA', province: 'Palermo'},
  {code: 'PR', province: 'Parma'},
  {code: 'PV', province: 'Pavia'},
  {code: 'PG', province: 'Perugia'},
  {code: 'PU', province: 'Pesaro e Urbino'},
  {code: 'PE', province: 'Pescara'},
  {code: 'PC', province: 'Piacenza'},
  {code: 'PI', province: 'Pisa'},
  {code: 'PT', province: 'Pistoia'},
  {code: 'PN', province: 'Pordenone'},
  {code: 'PZ', province: 'Potenza'},
  {code: 'PO', province: 'Prato'},
  {code: 'RG', province: 'Ragusa'},
  {code: 'RA', province: 'Ravenna'},
  {code: 'RC', province: 'Reggio Calabria'},
  {code: 'RE', province: 'Reggio Emilia'},
  {code: 'RI', province: 'Rieti'},
  {code: 'RN', province: 'Rimini'},
  {code: 'RM', province: 'Roma'},
  {code: 'RO', province: 'Rovigo'},
  {code: 'SA', province: 'Salerno'},
  {code: 'SS', province: 'Sassari'},
  {code: 'SV', province: 'Savona'},
  {code: 'SI', province: 'Siena'},
  {code: 'SR', province: 'Siracusa'},
  {code: 'SO', province: 'Sondrio'},
  {code: 'SU', province: 'Sud Sardegna'},
  {code: 'TA', province: 'Taranto'},
  {code: 'TE', province: 'Teramo'},
  {code: 'TR', province: 'Terni'},
  {code: 'TO', province: 'Torino'},
  {code: 'TP', province: 'Trapani'},
  {code: 'TN', province: 'Trento'},
  {code: 'TV', province: 'Treviso'},
  {code: 'TS', province: 'Trieste'},
  {code: 'UD', province: 'Udine'},
  {code: 'VA', province: 'Varese'},
  {code: 'VE', province: 'Venezia'},
  {code: 'VB', province: 'Verbano-Cusio-Ossola'},
  {code: 'VC', province: 'Vercelli'},
  {code: 'VR', province: 'Verona'},
  {code: 'VV', province: 'Vibo Valentia'},
  {code: 'VI', province: 'Vicenza'},
  {code: 'VT', province: 'Viterbo'},
  {code: 'EE', province: 'Estero'}
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
            <v-select v-model="selectedProvince" :options="provinces" :reduce="province => province.code" label="province" :searchable="true" :clearable="false"
                placeholder="Cerca" class="tt-chat-province-dropdown" append-to-body />
        </div>

        <button class="tt-chat-province-button" @click="handleConfirm" :disabled="!selectedProvince">
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

        // Override degli stili di vue-select per mantenere coerenza con il tema
        :deep(.vs__dropdown-toggle) {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 14px;
            min-height: 38px;
        }

        :deep(.vs__selected-options) {
            padding: 4px 0;
        }

        :deep(.vs__search) {
            font-size: 14px;
            margin: 0;
            padding: 0;
        }

        :deep(.vs__search::placeholder) {
            color: #999;
        }

        :deep(.vs__dropdown-toggle):focus-within {
            border-color: var(--tt-chat-primary-color);
            box-shadow: 0 0 0 1px var(--tt-chat-primary-color);
        }

        :deep(.vs__dropdown-menu) {
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-size: 14px;
        }

        :deep(.vs__dropdown-option) {
            padding: 8px 12px;
        }

        :deep(.vs__dropdown-option--highlight) {
            background-color: var(--tt-chat-primary-color);
            color: white;
        }

        :deep(.vs__clear) {
            display: none; // Nascondi il pulsante clear dato che clearable=false
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