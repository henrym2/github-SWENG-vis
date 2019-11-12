import { mount } from '@vue/test-utils'
import App from './../src/App.vue'
import { toBindingIdentifierName } from '@babel/types'

describe('App',() => {
    test("Is rendering", () => {
        const wrapper = mount(App)
        expect(wrapper.vm.currentUser).toBe("")
        const navButton = wrapper.find('#nav-button-1')
        navButton.exists()
        const search = wrapper.find('#user_search')
        search.exists()
        search.setValue("henrym2")
    })
})