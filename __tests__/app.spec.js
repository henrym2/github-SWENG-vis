import { shallowMount } from '@vue/test-utils'
import App from './../src/App.vue'
import { toBindingIdentifierName } from '@babel/types'
import {
    createLocalVue
} from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)

describe('App',() => {
    test("Is rendering", () => {
        const wrapper = shallowMount(App, {localVue})
        expect(wrapper.vm.currentUser).toBe("")
        const navButton = wrapper.find('#nav-button-1')
        navButton.exists()
        const search = wrapper.find('#user_search')
        search.exists()
        search.setValue("henrym2")
    })
})