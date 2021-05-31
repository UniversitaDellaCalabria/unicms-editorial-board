<template>

    <b-form @submit="submit">

        <b-form-group
            v-for="field in this.fields" :key="field.id"
            :id="'input-group-' + field.id"
            :label="field.required ? field.label + ' *' : field.label"
            :label-for="field.id"
            :description="field.help_text">

            <b-form-checkbox
                v-if="field.type == 'checkbox'"
                v-model="form[field.id]"
                :id="field.id"
                :name="field.id"
                :required="field.required ? true : false">
            </b-form-checkbox>

            <div v-else-if="field.type == 'select'">

                <v-select
                    v-if="field.api_source"
                    v-model="form[field.id]"
                    @search="fetchOptions(field.id, field.api_source, $event)"
                    @option:selected="setSelected(field.id, $event)"
                    label="text"
                    :reduce="value => value.value"
                    :options="options[field.id]"
                    :filterable="false"
                    :id="field.id"
                    :multiple="field.multiple ? true : false"
                    :required="field.required ? true : false">
                    <template #no-options="{ search, searching, loading }">
                        <span v-if="search">No results for <b>{{ search }}</b></span>
                        <span v-else>This field is actually empty</span>
                    </template>
                    <template #list-footer>
                        <hr>
                        <li style="text-align: center; opacity: .8">
                            Type to search...
                        </li>
                    </template>
                </v-select>
                <v-select
                    v-else
                    v-model="form[field.id]"
                    label="text"
                    :reduce="value => value.value"
                    :options="field.options"
                    :id="field.id"
                    :multiple="field.multiple ? true : false"
                    :required="field.required ? true : false">
                </v-select>

                <a
                    v-if="field.id in add_modal_fields"
                    @click="openPopup(field.id)"
                    class="btn btn-success btn-sm mt-2">
                    Add new
                </a>

                <div class="mt-3" v-if="field.id in files && files[field.id]">
                    <p>Selected</p>
                    <b-img
                        v-if="$is_image(files[field.id])"
                        :src="files[field.id]"
                        fluid
                        :alt="field.label"
                        class="w-25">
                    </b-img>
                    <p v-else>
                        <a :href="files[field.id]">
                            {{ files[field.id] }}
                        </a>
                    </p>
                </div>
            </div>

            <ckeditor
                v-else-if="field.type == 'textarea' && rich_text_fields.includes(field.id)"
                :editor="editor"
                v-model="form[field.id]"
                :id="field.id"
                :config="editorConfig"
                :required="field.required ? true : false"></ckeditor>

            <b-form-textarea
                v-else-if="field.type == 'textarea'"
                v-model="form[field.id]"
                :id="field.id"
                rows="1"
                max-rows="25"
                :required="field.required ? true : false">
            </b-form-textarea>

            <div v-else-if="field.type == 'file'">
                <b-form-file
                  v-model="form[field.id]"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here...">
                </b-form-file>
                <div class="mt-3" v-if="field.id in files && files[field.id]">
                    <p>Selected file</p>
                    <b-img
                        v-if="$is_image(files[field.id])"
                        :src="files[field.id]"
                        fluid
                        :alt="field.label"
                        class="w-25">
                    </b-img>
                    <p v-else>
                        <a :href="files[field.id]">
                            {{ files[field.id] }}
                        </a>
                    </p>
                </div>
            </div>

            <datetime
                v-else-if="field.type == 'datetime'"
                class="form-control"
                firstDayOfWeek="1"
                format="YYYY-MM-DD H:i"
                v-model="form[field.id]"
                :id="field.id"
                :required="field.required ? true : false">
            </datetime>

            <div v-else>
                <b-form-tags
                    v-if="tag_fields.includes(field.id)"
                    v-model="form[field.id]"
                    :type="field.type"
                    :id="field.id"
                    :required="field.required ? true : false">
                </b-form-tags>
                <b-form-input
                    v-else
                    v-model="form[field.id]"
                    :type="field.type"
                    :id="field.id"
                    :required="field.required ? true : false">
                </b-form-input>
            </div>
        </b-form-group>

        <b-button type="submit" block variant="success">Save</b-button>

        <b-modal id="modal-1" title="BootstrapVue">
            <router-view :name="MediaNew">
        </b-modal>

    </b-form>

</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import datetime from 'vuejs-datetimepicker';

export default {
    name: "django-form",
    components: {
        ckeditor: CKEditor.component,
        datetime
    },
    props: {
        form: String,
        submit: String,
        form_source: String,
        files: { default: {} },
        add_modal_fields: { default: {} },
        rich_text_fields: { default: [] },
        tag_fields: { default: [] }
    },
    data () {
        return {
            initial: {},
            options: {},
            selected: {},
            editor: ClassicEditor,
            editorConfig: {
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        '|',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'indent',
                        'outdent',
                        '|',
                        'blockQuote',
                        '|',
                        'insertTable',
                        'undo',
                        'redo'
                    ]
                },
            },
            fields: []
        }
    },
    methods: {
        getForm() {
            this.axios
                .get(this.form_source)
                .then(response => {
                    this.fields = response.data;
                })
        },
        fetchOptions(id, api_source, search) {
            if(search!=''){
                // if api_source already contains GET params use '&', else '?'
                let char = api_source.includes('?') ? '&' : '?'
                this.axios
                    .get(api_source + char + 'search=' + search)
                    .then(response => {
                        this.$set(this.options, id, response.data.results);
                    })
            } else if(this.selected[id]){
                this.$set(this.options, id, [this.selected[id]]);
            } else {
                this.$set(this.options, id, this.initial[id]);
            }
        },
        setSelected(id, value){
            this.$set(this.selected, id, value);
        },
        getOptionsFromParent(id, value){
            this.$set(this.initial, id, value);
            this.$set(this.options, id, value);
        },
        openPopup(field_id){
            window.open(document.location.origin+'/editorial-board/'+this.add_modal_fields[field_id]+'?mode=raw',
                        field_id,
                        'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=800,height=600');

        }
    },
    mounted() {
        this.getForm();
    }
}
</script>
