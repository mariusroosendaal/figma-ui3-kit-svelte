<script>
    //This is a simple app playground to test components and their markup

    // Global CSS
    import style from "../src/global.css";

    //Components
    import Button from "../src/components/Button/index.svelte";
    import Checkbox from "../src/components/Checkbox/index.svelte";
    import Switch from "../src/components/Switch/index.svelte";
    import Slider from "../src/components/Slider/index.svelte";
    import Tabs from "../src/components/Tabs/index.svelte";
    import Disclosure from "../src/components/Disclosure/index.svelte";
    import DisclosureItem from "../src/components/DisclosureItem/index.svelte";
    import Icon from "../src/components/Icon/index.svelte";
    import IconButton from "../src/components/IconButton/index.svelte";
    import Input from "../src/components/Input/index.svelte";
    import Label from "../src/components/Label/index.svelte";
    import Radio from "../src/components/Radio/index.svelte";
    import Dropdown from "../src/components/Dropdown/index.svelte";
    import Menu from "../src/components/Menu/index.svelte";
    import Textarea from "../src/components/Textarea/index.svelte";
    import Text from "../src/components/Text/index.svelte";
    import Tooltip from "../src/components/Tooltip/index.svelte";
    import Chip from "../src/components/Chip/index.svelte";
    import Badge from "../src/components/Badge/index.svelte";
    import Banner from "../src/components/Banner/index.svelte";
    import Modal from "../src/components/Modal/index.svelte";

    // UI3 Icons (24px default)
    import IconCheck from "../src/icons/24/icon.24.check.svg";
    import IconClose from "../src/icons/24/icon.24.close.svg";
    import IconPlus from "../src/icons/24/icon.24.plus.svg";
    import IconMinus from "../src/icons/24/icon.24.minus.svg";
    import IconSettings from "../src/icons/24/icon.24.settings.svg";
    import IconSearch from "../src/icons/24/icon.24.visual.search.svg";
    import IconTrash from "../src/icons/24/icon.24.trash.svg";
    import IconWarning from "../src/icons/24/icon.24.warning.small.svg";
    import IconArrow from "../src/icons/24/icon.24.arrow.svg";
    import IconChevronRight from "../src/icons/24/icon.24.chevron.right.svg";
    import IconChevronDown from "../src/icons/24/icon.24.chevron.down.svg";
    import IconChevronUp from "../src/icons/24/icon.24.chevron.up.svg";

    // 16px alternatives for compact layouts
    import Icon16Check from "../src/icons/16/icon.16.check.svg";
    import Icon16Close from "../src/icons/16/icon.16.close.svg";
    import Icon16Plus from "../src/icons/16/icon.16.plus.svg";
    import Icon16ChevronRight from "../src/icons/16/icon.16.chevron.right.svg";
    import Icon16ChevronDown from "../src/icons/16/icon.16.chevron.down.svg";
    import Icon16Variable from "../src/icons/16/icon.16.variable.svg";
    import Icon16Feedback from "../src/icons/16/icon.16.feedback.svg";
    import Icon16Unread from "../src/icons/16/icon.16.unread.svg";

    //var to store the selected value of our radio button group
    var radioValue = "a";

    // Slider state variables
    let sliderValue1 = 0;     // Delta at default
    let sliderValue2 = -100;  // Delta negative
    let sliderValue3 = 100;   // Delta positive
    let sliderValue4 = 60;    // Delta with custom default
    let rangeValue1 = 80;
    let rangeValue2 = 0;
    let rangeValue3 = 90;
    let stepperValue1 = 50;
    let stepperValue2 = 25;
    let stepperValue3 = 0;
    let disabledValue1 = -50;
    let disabledValue2 = 60;
    let disabledValue3 = 40;
    let focusValue1 = 0;
    let customValue1 = 100;
    let customValue2 = 30;

    //Tabs state
    let selectedTab = 0;
    let tabsData = ["Active Tab", "Second tab", "Third tab", "Fourth tab"];

    //Arrays for select menu
    //example without a selected item
    let menuItemsExample0;

    //this function dynamically updates the first empty select menu example with data
    function populateMenu() {
        menuItemsExample0 = [
            {
                value: "item1",
                label: "Menu item 1",
                group: null,
                selected: true,
            },
            {
                value: "item2",
                label: "Menu item 2 ",
                group: null,
                selected: false,
            },
        ]; 
    }

    // Menu selection handlers
    function handleMenuSelect1(event) {
        selectedItem1 = event.detail;
        console.log("Menu 1 selected:", event.detail);
    }

    function handleMenuSelect2(event) {
        selectedItem2 = event.detail;
        console.log("Menu 2 selected:", event.detail);
    }

    function handleMenuSelect3(event) {
        selectedItem3 = event.detail;
        console.log("Menu 3 selected:", event.detail);
    }

    function handleMenuSelect4(event) {
        selectedItem4 = event.detail;
        console.log("Menu 4 selected:", event.detail);
    }
    function handleMenuSelect5(event) {
        selectedItem5 = event.detail;
        console.log("Menu 5 selected:", event.detail);
    }
    function handleMenuSelect6(event) {
        selectedItem6 = event.detail;
        console.log("Menu 6 selected:", event.detail);
    }
    function handleMenuSelect7(event) {
        selectedItem7 = event.detail;
        console.log("Menu 7 selected:", event.detail);
    }
    function handleMenuSelect8(event) {
        selectedItem8 = event.detail;
        console.log("Menu 8 selected:", event.detail);
    }
    function handleMenuSelect9(event) {
        selectedItem9 = event.detail;
        console.log("Nested Menu selected:", event.detail);
    }

    // Modal handler functions
    function handleIcon2Action() {
        console.log("Icon2 clicked");
    }

    function handleSave() {
        console.log("Save clicked");
    }

    let menuItemsExample1 = [
        { value: "item1", label: "Menu item 1", group: null, selected: false },
        { value: "item2", label: "Menu item 2 ", group: null, selected: false },
        { value: "item3", label: "Menu item 3", group: null, selected: false },
        { value: "item4", label: "Menu item 4", group: null, selected: false },
    ];
    //example with an initial selection
    let menuItemsExample2 = [
        { value: "item1", label: "Menu item 1", group: null, selected: false },
        { value: "item2", label: "Menu item 2 ", group: null, selected: true },
        { value: "item3", label: "Menu item 3", group: null, selected: false },
        { value: "item4", label: "Menu item 4", group: null, selected: false },
    ];
    //example with option groups (we will show the labels with a prop)
    let menuItemsExample3 = [
        {
            value: "item1",
            label: "Granny Smith",
            group: "Apples",
            selected: false,
        },
        {
            value: "item2",
            label: "Honey Crisp ",
            group: "Apples",
            selected: true,
        },
        { value: "item3", label: "Blood", group: "Oranges", selected: false },
        {
            value: "item4",
            label: "Valencia",
            group: "Oranges",
            selected: false,
        },
    ];
    
    // Example with nested sub-menus
    let menuItemsNested = [
        { value: "copy", label: "Copy", selected: false },
        { 
            value: "copy-paste", 
            label: "Copy / Paste as", 
            selected: false,
            subMenu: [
                { value: "png", label: "PNG", selected: false },
                { value: "jpg", label: "JPG", selected: false },
                { value: "svg", label: "SVG", selected: false },
                { value: "pdf", label: "PDF", selected: false }
            ]
        },
        { value: "paste", label: "Paste", selected: false },
        { 
            value: "export", 
            label: "Export", 
            selected: false,
            subMenu: [
                { value: "export-selected", label: "Export Selected", selected: false },
                { 
                    value: "export-options", 
                    label: "Export Options", 
                    selected: false,
                    subMenu: [
                        { value: "export-all", label: "Export All Pages", selected: false },
                        { value: "export-frame", label: "Export Frame Only", selected: false }
                    ]
                },
                { value: "export-png", label: "As PNG", selected: false },
                { value: "export-svg", label: "As SVG", selected: false }
            ]
        },
        { value: "delete", label: "Delete", selected: false }
    ];
    
    //example with an initial selection and option groups
    let menuItemsExample4 = [
        {
            value: "item1",
            label: "Passthrough",
            group: "group1",
            selected: true,
        },
        { value: "item2", label: "Normal ", group: "group1", selected: false },
        { value: "item3", label: "Darken", group: "group2", selected: false },
        { value: "item4", label: "Multiply", group: "group2", selected: false },
        {
            value: "item4",
            label: "Color Burn",
            group: "group2",
            selected: false,
        },
    ];

    // Menu state variables
    let menuOpen1 = false;
    let menuOpen2 = false;
    let menuOpen3 = false;
    let menuOpen4 = false;
    let menuOpen5 = false;
    let menuOpen6 = false;
    let menuOpen7 = false;
    let menuOpen8 = false;
    let menuOpen9 = false; // For nested menu example
    let selectedItem1 = null;
    let selectedItem2 = null;
    let selectedItem3 = null;
    let selectedItem4 = null;
    let selectedItem5 = null;
    let selectedItem6 = null;
    let selectedItem7 = null;
    let selectedItem8 = null;
    let selectedItem9 = null; // For nested menu example
    let menuAnchor1 = null;
    let menuAnchor2 = null;
    let menuAnchor3 = null;
    let menuAnchor4 = null;
    let menuAnchor5 = null;
    let menuAnchor6 = null;
    let menuAnchor7 = null;
    let menuAnchor8 = null;
    let menuAnchor9 = null; // For nested menu example

    // Modal state variables
    let modalOpen = false;
    let modalWithIcon2Open = false;
    let modalWithCheckboxOpen = false;
    let modalWithSwitchOpen = false;
    let modalSmallOpen = false;
    let modalLargeOpen = false;
    let modalWithFullFooterOpen = false;
    
    // New Modal demos
    let modalHeight50vhOpen = false;
    let modalHeight80vhOpen = false;
    let modalLeftPanelOpen = false;
    let modalRightPanelOpen = false;
    let modalBottomSheetOpen = false;
    let modalFloatingPanelOpen = false;
    let modalEdgeToEdgeOpen = false;
    let modalEdgeToEdgeLeftOpen = false;
    let modalEdgeToEdgeBottomOpen = false;

    // Anchor navigation state
    let activeSection = 'modal';
    let navItems = [
        { id: 'modal', label: 'Modal' },
        { id: 'typography', label: 'Typography' },
        { id: 'tooltip', label: 'Tooltip' },
        { id: 'buttons', label: 'Buttons' },
        { id: 'badges', label: 'Badges' },
        { id: 'banners', label: 'Banners' },
        { id: 'checkboxes', label: 'Checkboxes' },
        { id: 'switches', label: 'Switches' },
        { id: 'sliders', label: 'Sliders' },
        { id: 'radio-buttons', label: 'Radio Buttons' },
        { id: 'disclosure', label: 'Disclosure' },
        { id: 'tabs', label: 'Tabs' },
        { id: 'icons', label: 'Icons' },
        { id: 'icon-buttons', label: 'Icon Buttons' },
        { id: 'input-fields', label: 'Input Fields' },
        { id: 'textarea-fields', label: 'Textarea Fields' },
        { id: 'chips', label: 'Chips' },
        { id: 'labels-sections', label: 'Labels' },
        { id: 'dropdown', label: 'Dropdown' },
        { id: 'menu', label: 'Menu' }
    ];

    // Function to scroll to section
    function scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            activeSection = sectionId;
        }
    }

    // Function to handle scroll and update active section
    function handleScroll() {
        const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
        const scrollPosition = window.scrollY + 100; // Offset for better UX

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPosition) {
                activeSection = navItems[i].id;
                break;
            }
        }
    }

    // Add scroll listener when component mounts
    import { onMount, onDestroy } from 'svelte';
    
    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
    });

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll);
    });
</script>

<div class="wrapper" style="background-color: var(--figma-color-bg)">
    <h1>Figma Plugin UI Svelte</h1>
    
    <!-- Anchor Navigation -->
    <nav class="anchor-nav">
        <div class="nav-content">
            <h3>Components</h3>
            <ul class="nav-list">
                {#each navItems as item}
                    <li class="nav-item">
                        <button 
                            class="nav-link" 
                            class:active={activeSection === item.id}
                            on:click={() => scrollToSection(item.id)}
                        >
                            {item.label}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </nav>

    <section id="modal">
        <h2>Modal</h2>
        <div class="flex column gap-xxsmall">
            <div class="flex gap-xxsmall">
                <Button on:click={() => (modalOpen = true)}
                    >Open Basic Modal</Button
                >
                <Button on:click={() => (modalWithIcon2Open = true)}
                    >Open Modal with Icon2</Button
                >
                <Button on:click={() => (modalWithCheckboxOpen = true)}
                    >Open Modal with Checkbox</Button
                >
            </div>
            <div class="flex gap-xxsmall">
                <Button on:click={() => (modalWithSwitchOpen = true)}
                    >Open Modal with Switch</Button
                >
                <Button on:click={() => (modalSmallOpen = true)}
                    >Open Small Modal</Button
                >
                <Button on:click={() => (modalLargeOpen = true)}
                    >Open Large Modal</Button
                >
            </div>
            <div class="flex gap-xxsmall">
                <Button on:click={() => (modalWithFullFooterOpen = true)}
                    >Open Modal with Full Footer</Button
                >
            </div>
            
            <!-- New Modal Features -->
            <h3>Height Options</h3>
            <div class="flex gap-xxsmall">
                <Button on:click={() => (modalHeight50vhOpen = true)}
                    >50vh Height Modal</Button
                >
                <Button on:click={() => (modalHeight80vhOpen = true)}
                    >80vh Height Modal</Button
                >
            </div>
            
            <h3>Position Options</h3>
            <div class="flex gap-xxsmall">
                <Button on:click={() => (modalLeftPanelOpen = true)}
                    >Left Side Panel</Button
                >
                <Button on:click={() => (modalRightPanelOpen = true)}
                    >Right Side Panel</Button
                >
                <Button on:click={() => (modalBottomSheetOpen = true)}
                    >Bottom Sheet</Button
                >
            </div>
            
            <h3>Padding Options</h3>
            <div class="flex gap-xxsmall">
                <Button on:click={() => (modalFloatingPanelOpen = true)}
                    >Floating Panel (24px)</Button
                >
                <Button on:click={() => (modalEdgeToEdgeOpen = true)}
                    >Edge-to-Edge Right</Button
                >
                <Button on:click={() => (modalEdgeToEdgeLeftOpen = true)}
                    >Edge-to-Edge Left</Button
                >
                <Button on:click={() => (modalEdgeToEdgeBottomOpen = true)}
                    >Edge-to-Edge Bottom</Button
                >
            </div>
        </div>

        <!-- Basic Modal -->
        <Modal bind:isOpen={modalOpen} title="Modal Title">
            <Text variant="body-medium"
                >Modal content goes here. This is a flexible content area that
                can contain any content you need. You can add multiple
                paragraphs, forms, or any other components.</Text
            >

            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalOpen = false)}
                    >Cancel</Button
                >
                <Button variant="primary" on:click={handleSave}>Save</Button>
            </svelte:fragment>
        </Modal>

        <!-- Modal with Icon2 -->
        <Modal
            bind:isOpen={modalWithIcon2Open}
            title="Modal with Icon2"
            icon2={true}
            icon2Name={IconSettings}
            onIcon2Click={handleIcon2Action}
        >
            <Text variant="body-medium"
                >Modal with an additional icon button in the header. Click the
                settings icon to see the action.</Text
            >

            <svelte:fragment slot="footer-right">
                <Button
                    variant="primary"
                    size="wide"
                    on:click={() => (modalWithIcon2Open = false)}>Done</Button
                >
            </svelte:fragment>
        </Modal>

        <!-- Modal with Footer Checkbox -->
        <Modal bind:isOpen={modalWithCheckboxOpen} title="Modal with Checkbox">
            <Text variant="body-medium"
                >Modal with a checkbox in the footer. This demonstrates the left
                and right slot functionality.</Text
            >
            <svelte:fragment slot="footer-left">
                <Checkbox label="Remember my choice" />
            </svelte:fragment>

            <svelte:fragment slot="footer-right">
                <Button variant="primary">Save</Button>
            </svelte:fragment>
        </Modal>

        <!-- Modal with Footer Switch -->
        <Modal bind:isOpen={modalWithSwitchOpen} title="Modal with Switch">
            <Text variant="body-medium">Modal with a switch in the footer.</Text
            >
            <Text variant="body-medium"
                >Another example of the left and right slot functionality.</Text
            >

            <svelte:fragment slot="footer-left">
                <Switch label="Enable notifications" />
            </svelte:fragment>

            <svelte:fragment slot="footer-right">
                <Button variant="primary">Apply</Button>
            </svelte:fragment>
        </Modal>

        <!-- Small Modal -->
        <Modal bind:isOpen={modalSmallOpen} title="Small Modal" width="small">
            <Text variant="body-medium"
                >This is a small modal (240px wide).</Text
            >

            <svelte:fragment slot="footer-right">
                <Button
                    variant="primary"
                    on:click={() => (modalSmallOpen = false)}>OK</Button
                >
            </svelte:fragment>
        </Modal>

        <!-- Large Modal -->
        <Modal bind:isOpen={modalLargeOpen} title="Large Modal" width="large">
            <Text variant="body-medium"
                >This is a large modal (480px wide).</Text
            >
            <Text variant="body-medium"
                >It provides more space for complex content and forms.</Text
            >
            <Text variant="body-medium"
                >Perfect for detailed settings or multi-step workflows.</Text
            >

            <svelte:fragment slot="footer-right">
                <Button
                    variant="secondary"
                    on:click={() => (modalLargeOpen = false)}>Cancel</Button
                >
                <Button variant="primary">Continue</Button>
            </svelte:fragment>
        </Modal>

        <!-- Modal with Full-Width Footer -->
        <Modal
            bind:isOpen={modalWithFullFooterOpen}
            title="Modal with Full Footer"
        >
            <Text variant="body-medium"
                >This modal demonstrates a full-width footer.</Text
            >
            <Text variant="body-medium">
                Perfect for single primary actions that need to span the entire
                width.
            </Text>
            <Text variant="body-medium"
                >Multiple buttons will share the space equally.</Text
            >

            <svelte:fragment slot="footer-full">
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Complete Action</Button>
            </svelte:fragment>
        </Modal>

        <!-- Height Demo Modals -->
        <Modal bind:isOpen={modalHeight50vhOpen} title="50vh Height Modal" height="50vh">
            <Text variant="body-medium">This modal has a fixed height of 50vh.</Text>
            <Text variant="body-medium">The content area will scroll if it exceeds the height.</Text>
            <Text variant="body-medium">Perfect for forms or content that needs consistent sizing.</Text>
            <Text variant="body-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
            <Text variant="body-medium">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalHeight50vhOpen = false)}>Close</Button>
                <Button variant="primary">Save</Button>
            </svelte:fragment>
        </Modal>

        <Modal bind:isOpen={modalHeight80vhOpen} title="80vh Height Modal" height="80vh">
            <Text variant="body-medium">This modal has a fixed height of 80vh.</Text>
            <Text variant="body-medium">It takes up most of the viewport height while still showing some background.</Text>
            <Text variant="body-medium">Great for detailed forms or content that needs more space.</Text>
            <Text variant="body-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
            <Text variant="body-medium">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
            <Text variant="body-medium">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalHeight80vhOpen = false)}>Close</Button>
                <Button variant="primary">Save</Button>
            </svelte:fragment>
        </Modal>

        <!-- Position Demo Modals -->
        <Modal bind:isOpen={modalLeftPanelOpen} title="Left Side Panel" position="left" width="medium">
            <Text variant="body-medium">This is a left side panel.</Text>
            <Text variant="body-medium">It slides in from the left side of the screen.</Text>
            <Text variant="body-medium">Perfect for navigation menus or secondary content.</Text>
            <Text variant="body-medium">The panel takes full height by default, respecting the overlay padding.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalLeftPanelOpen = false)}>Close</Button>
            </svelte:fragment>
        </Modal>

        <Modal bind:isOpen={modalRightPanelOpen} title="Right Side Panel" position="right" width="medium">
            <Text variant="body-medium">This is a right side panel.</Text>
            <Text variant="body-medium">It slides in from the right side of the screen.</Text>
            <Text variant="body-medium">Great for property panels or contextual information.</Text>
            <Text variant="body-medium">The panel takes full height by default, respecting the overlay padding.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalRightPanelOpen = false)}>Close</Button>
            </svelte:fragment>
        </Modal>

        <Modal bind:isOpen={modalBottomSheetOpen} title="Bottom Sheet" position="bottom" height="50vh">
            <Text variant="body-medium">This is a bottom sheet.</Text>
            <Text variant="body-medium">It slides up from the bottom of the screen.</Text>
            <Text variant="body-medium">Perfect for mobile-friendly interfaces or quick actions.</Text>
            <Text variant="body-medium">The sheet takes full width by default, respecting the overlay padding.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalBottomSheetOpen = false)}>Close</Button>
                <Button variant="primary">Action</Button>
            </svelte:fragment>
        </Modal>

        <!-- Padding Demo Modals -->
        <Modal bind:isOpen={modalFloatingPanelOpen} title="Floating Panel" position="right" width="medium" overlayPadding="24px">
            <Text variant="body-medium">This panel has 24px padding around it.</Text>
            <Text variant="body-medium">It creates a floating effect with space around the edges.</Text>
            <Text variant="body-medium">The padding creates visual separation from the screen edges.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalFloatingPanelOpen = false)}>Close</Button>
            </svelte:fragment>
        </Modal>

        <Modal bind:isOpen={modalEdgeToEdgeOpen} title="Edge-to-Edge Panel" position="right" width="medium" overlayPadding="0px">
            <Text variant="body-medium">This panel has no padding (0px).</Text>
            <Text variant="body-medium">It extends all the way to the screen edges.</Text>
            <Text variant="body-medium">Notice how the border-radius is removed for a cleaner edge-to-edge look.</Text>
            <Text variant="body-medium">Perfect for immersive experiences or when you want maximum space.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalEdgeToEdgeOpen = false)}>Close</Button>
            </svelte:fragment>
        </Modal>

        <Modal bind:isOpen={modalEdgeToEdgeLeftOpen} title="Edge-to-Edge Left Panel" position="left" width="medium" overlayPadding="0px">
            <Text variant="body-medium">This left panel has no padding (0px).</Text>
            <Text variant="body-medium">It extends all the way to the left screen edge.</Text>
            <Text variant="body-medium">Notice the sharp corners on the left side for a native app feel.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalEdgeToEdgeLeftOpen = false)}>Close</Button>
            </svelte:fragment>
        </Modal>

        <Modal bind:isOpen={modalEdgeToEdgeBottomOpen} title="Edge-to-Edge Bottom Sheet" position="bottom" height="60vh" overlayPadding="0px">
            <Text variant="body-medium">This bottom sheet has no padding (0px).</Text>
            <Text variant="body-medium">It extends all the way to the bottom screen edge.</Text>
            <Text variant="body-medium">Notice the sharp corners on the bottom for a native mobile feel.</Text>
            <Text variant="body-medium">Perfect for mobile-style interfaces or full-screen content.</Text>
            
            <svelte:fragment slot="footer-right">
                <Button variant="secondary" on:click={() => (modalEdgeToEdgeBottomOpen = false)}>Close</Button>
                <Button variant="primary">Action</Button>
            </svelte:fragment>
        </Modal>
    </section>
    <section id="typography">
        <h2>Typography System - Text Component</h2>
        <caption class="mb-xsmall"
            >UI3 Text component with comprehensive typography variants, alignment options, and color customization</caption
        >

        <div class="mb-xsmall">
            <h3>Heading Variants</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall);">
                <Text variant="heading-large">Heading Large (24/32) - Primary page titles</Text>
                <Text variant="heading-medium">Heading Medium (15/25) - Section headings</Text>
                <Text variant="heading-small">Heading Small (13/22) - Subsection headings</Text>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Body Variants - Regular</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall);">
                <Text variant="body-large">Body Large (13/22) - Multiline content and descriptions</Text>
                <Text variant="body-medium">Body Medium (11/16) - Default UI text and labels</Text>
                <Text variant="body-small">Body Small (9/14) - Small UI elements and captions</Text>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Body Variants - Strong (Bold)</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall);">
                <Text variant="body-large-strong">Body Large Strong (13/22) - Emphasized large text</Text>
                <Text variant="body-medium-strong">Body Medium Strong (11/16) - Emphasized medium text</Text>
                <Text variant="body-small-strong">Body Small Strong (9/14) - Emphasized small text</Text>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Text Alignment</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall);">
                <Text variant="body-medium" align="start" block>Left aligned text (default)</Text>
                <Text variant="body-medium" align="center" block>Center aligned text</Text>
                <Text variant="body-medium" align="end" block>Right aligned text</Text>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Color Variations</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall);">
                <Text variant="body-medium" color="--figma-color-text">Default text color</Text>
                <Text variant="body-medium" color="--figma-color-text-secondary">Secondary text color</Text>
                <Text variant="body-medium" color="--figma-color-text-tertiary">Tertiary text color</Text>
                <Text variant="body-medium" color="--figma-color-text-disabled">Disabled text color</Text>
                <Text variant="body-medium" color="--figma-color-text-brand">Brand text color</Text>
                <Text variant="body-medium" color="--figma-color-text-danger">Danger text color</Text>
                <Text variant="body-medium" color="--figma-color-text-success">Success text color</Text>
                <Text variant="body-medium" color="--figma-color-text-warning">Warning text color</Text>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Block vs Inline</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall);">
                <div>
                    <Text variant="body-medium">Inline text (default)</Text>
                    <Text variant="body-medium" color="--figma-color-text-brand"> continues on same line</Text>
                </div>
                <div>
                    <Text variant="body-medium" block>Block text</Text>
                    <Text variant="body-medium" block color="--figma-color-text-brand">starts on new line</Text>
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Real-World Examples</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall);">
                <div class="mb-xsmall">
                    <Text variant="heading-large" block>Welcome to Figma Plugin</Text>
                    <Text variant="body-large" color="--figma-color-text-secondary" block>
                        This is a subtitle that provides additional context about the page
                    </Text>
                </div>
                
                <div class="mb-xsmall" style="border-top: 1px solid var(--figma-color-border); padding-top: var(--size-xsmall);">
                    <Text variant="heading-medium" block>Settings Section</Text>
                    <Text variant="body-medium" block>
                        Configure your preferences below. You can <Text variant="body-medium-strong" color="--figma-color-text-brand">enable notifications</Text> or <Text variant="body-medium-strong" color="--figma-color-text-danger">delete your account</Text>.
                    </Text>
                </div>

                <div class="mb-xsmall" style="border-top: 1px solid var(--figma-color-border); padding-top: var(--size-xsmall);">
                    <Text variant="body-small" color="--figma-color-text-tertiary" block>
                        Last updated: October 22, 2025
                    </Text>
                    <Text variant="body-small" color="--figma-color-text-success" block>
                        ✓ All changes saved
                    </Text>
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Mixed Variants in Context</h3>
            <div class="flex column gap-xxsmall" style="border: 1px solid var(--figma-color-border); padding: var(--size-xsmall); background-color: var(--figma-color-bg-secondary);">
                <Text variant="heading-small" block>Component Properties</Text>
                <div style="padding-left: var(--size-xsmall);">
                    <Text variant="body-medium" block><Text variant="body-medium-strong">Width:</Text> 320px</Text>
                    <Text variant="body-medium" block><Text variant="body-medium-strong">Height:</Text> 240px</Text>
                    <Text variant="body-medium" block><Text variant="body-medium-strong">Status:</Text> <Text color="--figma-color-text-success">Published</Text></Text>
                </div>
                <Text variant="body-small" color="--figma-color-text-tertiary" block style="margin-top: var(--size-xxsmall);">
                    Tip: Click on any property to edit its value
                </Text>
            </div>
        </div>
    </section>

    <section id="tooltip">
        <h2>Tooltip</h2>
        <caption class="mb-xsmall"
            >Tooltip component that adds hover tooltips to any
            interactive element. Zero bloat to existing components - wrap any
            element to add tooltip functionality.</caption
        >

        <div class="mb-xsmall">
            <h3>Buttons with Tooltips</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex gap-xxsmall">
                    <Tooltip label="Save your changes" hotkeyText="⌘S">
                        <Button variant="primary">Save</Button>
                    </Tooltip>
                    <Tooltip
                        label="Cancel and discard changes"
                        hotkey={false}
                    >
                        <Button variant="secondary">Cancel</Button>
                    </Tooltip>
                    <Tooltip
                        label="Delete this item permanently"
                        hotkeyText="⌘⌫"
                    >
                        <Button
                            variant="destructive"
                            iconName={IconTrash}
                            iconPosition="left">Delete</Button
                        >
                    </Tooltip>
                </div>
                <div class="flex gap-xxsmall">
                    <Tooltip
                        label="Open settings panel"
                        direction="Bottom"
                    >
                        <Button
                            variant="ghost"
                            iconName={IconSettings}
                            iconPosition="left">Settings</Button
                        >
                    </Tooltip>
                    <Tooltip label="Add new item" direction="BottomLeft">
                        <Button
                            variant="success"
                            iconName={IconPlus}
                            iconPosition="left">Add Item</Button
                        >
                    </Tooltip>
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>IconButtons with Tooltips</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex gap-xxsmall">
                    <Tooltip label="Settings" direction="Bottom">
                        <IconButton iconName={IconSettings} variant="default" />
                    </Tooltip>
                    <Tooltip label="Add new item" hotkeyText="⌘N">
                        <IconButton iconName={IconPlus} variant="default" />
                    </Tooltip>
                    <Tooltip label="Delete item" hotkey={false}>
                        <IconButton iconName={IconTrash} variant="default" />
                    </Tooltip>
                    <Tooltip label="Search" direction="BottomRight">
                        <IconButton iconName={IconSearch} variant="secondary" />
                    </Tooltip>
                </div>
                <div class="flex gap-xxsmall">
                    <Tooltip label="Previous page" direction="Left">
                        <IconButton
                            iconName={IconChevronRight}
                            variant="default"
                        />
                    </Tooltip>
                    <Tooltip label="Next page" direction="Right">
                        <IconButton
                            iconName={IconChevronRight}
                            variant="default"
                        />
                    </Tooltip>
                    <Tooltip label="Close panel" hotkeyText="⌘W">
                        <IconButton iconName={IconClose} variant="default" />
                    </Tooltip>
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Custom Elements with Tooltips</h3>
            <div class="flex gap-xxsmall align-items-center">
                <Tooltip
                    label="This is a custom div with a tooltip"
                    direction="Top"
                >
                    <div
                        style="padding: 8px 12px; background: var(--figma-color-bg-secondary); border-radius: 4px; cursor: pointer;"
                    >
                        Hover me
                    </div>
                </Tooltip>
                <Tooltip label="Custom styled button" hotkeyText="⌘K">
                    <button
                        style="padding: 6px 10px; background: var(--figma-color-bg-brand); color: var(--figma-color-text-onbrand); border: none; border-radius: 4px; cursor: pointer;"
                    >
                        Custom Button
                    </button>
                </Tooltip>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Tooltip Directions</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex gap-xxsmall">
                    <Tooltip label="Top tooltip" direction="Top">
                        <Button variant="secondary">Top</Button>
                    </Tooltip>
                    <Tooltip label="Bottom tooltip" direction="Bottom">
                        <Button variant="secondary">Bottom</Button>
                    </Tooltip>
                    <Tooltip label="Left tooltip" direction="Left">
                        <Button variant="secondary">Left</Button>
                    </Tooltip>
                    <Tooltip label="Right tooltip" direction="Right">
                        <Button variant="secondary">Right</Button>
                    </Tooltip>
                </div>
                <div class="flex gap-xxsmall">
                    <Tooltip label="Top Left" direction="TopLeft">
                        <Button variant="secondary">Top Left</Button>
                    </Tooltip>
                    <Tooltip label="Top Right" direction="TopRight">
                        <Button variant="secondary">Top Right</Button>
                    </Tooltip>
                    <Tooltip label="Bottom Left" direction="BottomLeft">
                        <Button variant="secondary">Bottom Left</Button>
                    </Tooltip>
                    <Tooltip
                        label="Bottom Right"
                        direction="BottomRight"
                    >
                        <Button variant="secondary">Bottom Right</Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    </section>

    <section id="buttons" style="background-color: var(--figma-color-bg)">
        <h2>Buttons</h2>
        <caption class="mb-xsmall"
            >UI3 Button component with comprehensive variants, sizes, and states</caption
        >

        <div class="mb-xsmall">
            <h3>Primary Variants</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall">
                    <Button variant="primary">Primary</Button>
                    <Button variant="primary" disabled>Primary Disabled</Button>
                </div>
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="primary"
                        iconName={IconPlus}
                        iconPosition="left">With Icon</Button
                    >
                    <Button
                        variant="primary"
                        iconName={IconPlus}
                        iconPosition="center">Icon Center</Button
                    >
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Secondary Variants</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="secondary" disabled
                        >Secondary Disabled</Button
                    >
                </div>
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="secondary"
                        iconName={IconSettings}
                        iconPosition="left">With Icon</Button
                    >
                    <Button
                        variant="secondary"
                        iconName={IconSettings}
                        iconPosition="center">Icon Center</Button
                    >
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Destructive Variants</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall">
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="destructive" disabled
                        >Destructive Disabled</Button
                    >
                </div>
                <div class="flex row gap-xxsmall">
                    <Button variant="secondary-destructive"
                        >Secondary Destructive</Button
                    >
                    <Button variant="secondary-destructive" disabled
                        >Secondary Destructive Disabled</Button
                    >
                </div>
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="destructive"
                        iconName={IconTrash}
                        iconPosition="left">Delete</Button
                    >
                    <Button
                        variant="secondary-destructive"
                        iconName={IconTrash}
                        iconPosition="left">Delete Secondary</Button
                    >
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Special Variants</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall">
                    <Button variant="success">Success</Button>
                    <Button variant="success" disabled>Success Disabled</Button>
                </div>
                <div class="flex row gap-xxsmall">
                    <Button variant="inverse">Inverse</Button>
                    <Button variant="inverse" disabled>Inverse Disabled</Button>
                </div>
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="success"
                        iconName={IconCheck}
                        iconPosition="left">Success with Icon</Button
                    >
                    <Button
                        variant="inverse"
                        iconName={IconCheck}
                        iconPosition="left">Inverse with Icon</Button
                    >
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Link Variants</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall">
                    <Button variant="link">Link Button</Button>
                    <Button variant="link" disabled>Link Disabled</Button>
                </div>
                <div class="flex row gap-xxsmall">
                    <Button variant="link-danger">Link Danger</Button>
                    <Button variant="link-danger" disabled
                        >Link Danger Disabled</Button
                    >
                </div>
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="link"
                        iconName={IconWarning}
                        iconPosition="left">Link with Icon</Button
                    >
                    <Button
                        variant="link-danger"
                        iconName={IconWarning}
                        iconPosition="left">Danger Link with Icon</Button
                    >
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Ghost Variants</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall">
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="ghost" disabled>Ghost Disabled</Button>
                </div>
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="ghost"
                        iconName={IconPlus}
                        iconPosition="left">Ghost with Icon</Button
                    >
                    <Button
                        variant="ghost"
                        iconName={IconPlus}
                        iconPosition="center">Ghost Icon Center</Button
                    >
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Size Variants</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall align-center">
                    <Button variant="primary" size="default"
                        >Default (24px)</Button
                    >
                    <Button variant="primary" size="large">Large (32px)</Button>
                </div>
                <div class="flex row gap-xxsmall align-center">
                    <Button
                        variant="secondary"
                        size="default"
                        iconName={IconPlus}
                        iconPosition="left">Default with Icon</Button
                    >
                    <Button
                        variant="secondary"
                        size="large"
                        iconName={IconPlus}
                        iconPosition="left">Large with Icon</Button
                    >
                    
                </div>
                <div class="flex column gap-xxsmall">
                    <Button variant="primary" size="wide"
                    iconName={IconSettings}
                    iconLead="left"
                        >Wide Button with Icon Center</Button
                    >
                    <Button
                        variant="secondary"
                        size="wide"
                        iconName={IconSettings}
                        iconLead="left">Wide Button with Icon Left</Button
                    >
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Interactive Examples</h3>
            <div class="flex column gap-xxsmall">
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="primary"
                        on:click={() => console.log("Primary clicked!")}
                        >Click Me</Button
                    >
                    <Button
                        variant="secondary"
                        on:click={() => console.log("Secondary clicked!")}
                        >Click Me Too</Button
                    >
                </div>
                <div class="flex row gap-xxsmall">
                    <Button
                        variant="destructive"
                        iconName={IconTrash}
                        iconPosition="left"
                        on:click={() => console.log("Delete clicked!")}
                        >Delete Item</Button
                    >
                    <Button
                        variant="success"
                        iconName={IconCheck}
                        iconPosition="left"
                        on:click={() => console.log("Success clicked!")}
                        >Save Changes</Button
                    >
                </div>
            </div>
        </div>
    </section>

    <section id="badges">
        <h2>Badges</h2>
        <caption class="mb-xsmall"
            >UI3 Badge component with comprehensive variants and states</caption
        >

        <div class="mb-xsmall">
            <h3>Basic Variants</h3>
            <div class="flex row gap-xxsmall flex-wrap">
                <Badge variant="default">Default</Badge>
                <Badge variant="brand">Brand</Badge>
                <Badge variant="component">Component</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="invert">Invert</Badge>
                <Badge variant="selected">Selected</Badge>
                <Badge variant="menu">Menu</Badge>
                <Badge variant="figjam">FigJam</Badge>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Strong Variants</h3>
            <div class="flex row gap-xxsmall flex-wrap">
                <Badge variant="brand" strong>Brand</Badge>
                <Badge variant="component" strong>Component</Badge>
                <Badge variant="danger" strong>Danger</Badge>
                <Badge variant="success" strong>Success</Badge>
                <Badge variant="warning" strong>Warning</Badge>
                <Badge variant="invert" strong>Invert</Badge>
                <Badge variant="figjam" strong>FigJam</Badge>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Icon Variants</h3>
            <div class="flex row gap-xxsmall flex-wrap">
                <Badge variant="variable" iconName={Icon16Variable}
                    >Variable</Badge
                >
                <Badge variant="variable-selected" iconName={Icon16Variable}
                    >Selected</Badge
                >
                <Badge variant="feedback" iconName={Icon16Feedback}
                    >Feedback</Badge
                >
                <Badge variant="merged" iconName={Icon16Unread}>Merged</Badge>
                <Badge variant="archived" iconName={Icon16Unread}
                    >Archived</Badge
                >
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Mixed Examples</h3>
            <div class="flex row gap-xxsmall flex-wrap">
                <Badge variant="brand" strong>New</Badge>
                <Badge variant="success">Published</Badge>
                <Badge variant="warning">Draft</Badge>
                <Badge variant="danger">Error</Badge>
                <Badge variant="component" iconName={Icon16Variable}
                    >Component</Badge
                >
                <Badge variant="merged" iconName={Icon16Unread}>Merged</Badge>
                <Badge variant="archived" iconName={Icon16Unread}
                    >Archived</Badge
                >
            </div>
        </div>
    </section>

    <section id="banners">
        <h2>Banners</h2>
        <caption class="mb-xsmall"
            >UI3 Banner component for displaying important messages with contextual variants</caption
        >

        <div class="mb-xsmall">
            <h3>Variants</h3>
            <div class="flex column gap-xxsmall">
                <Banner variant="danger">
                    If your new email doesn't match, you may lose access to some or all of your organization's files.
                </Banner>
                <Banner variant="warning">
                    This action will affect all team members. Please review before proceeding.
                </Banner>
                <Banner variant="info">
                    New features are available! Check out the latest updates to improve your workflow.
                </Banner>
                <Banner variant="success">
                    Your changes have been successfully saved and published.
                </Banner>
            </div>
        </div>
    </section>

    <section id="checkboxes">
        <h2>Checkboxes</h2>
        <caption class="mb-xsmall"
            >UI3 Checkbox component with new variants and states</caption
        >

        <div class="mb-xsmall">
            <h3>Basic States</h3>
            <div class="flex column gap-xxsmall">
                <Checkbox>Unchecked</Checkbox>
                <Checkbox checked>Checked</Checkbox>
                <Checkbox mixed>Mixed (Indeterminate)</Checkbox>
                <Checkbox disabled>Disabled</Checkbox>
                <Checkbox checked disabled>Checked Disabled</Checkbox>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Variants</h3>
            <div class="flex column gap-xxsmall">
                <Checkbox muted>Muted Unchecked</Checkbox>
                <Checkbox muted checked>Muted Checked</Checkbox>
                <Checkbox muted mixed>Muted Mixed</Checkbox>
                <Checkbox ghost>Ghost Unchecked</Checkbox>
                <Checkbox ghost checked>Ghost Checked</Checkbox>
                <Checkbox ghost mixed>Ghost Mixed</Checkbox>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Focus States</h3>
            <div class="flex column gap-xxsmall">
                <Checkbox tabindex="0">Focusable (Tab to focus)</Checkbox>
                <Checkbox checked tabindex="0">Checked Focusable</Checkbox>
                <Checkbox mixed tabindex="0">Mixed Focusable</Checkbox>
            </div>
        </div>
    </section>

    <section id="switches">
        <h2>Switches</h2>
        <caption class="mb-xsmall"
            >UI3 Switch component with improved sizing, spacing, and mixed state
            support</caption
        >

        <div class="mb-xsmall">
            <h3>Basic States</h3>
            <div class="flex column gap-xxsmall">
                <Switch>Unselected Switch</Switch>
                <Switch checked>Selected Switch</Switch>
                <Switch disabled>Disabled Switch</Switch>
                <Switch checked disabled>Selected Disabled Switch</Switch>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Mixed State</h3>
            <div class="flex column gap-xxsmall">
                <Switch mixed>Mixed State Switch</Switch>
                <Switch mixed disabled>Mixed Disabled Switch</Switch>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Focus States</h3>
            <div class="flex column gap-xxsmall">
                <Switch tabindex="0">Focusable Switch (Tab to focus)</Switch>
                <Switch checked tabindex="0">Checked Focusable Switch</Switch>
                <Switch mixed tabindex="0">Mixed Focusable Switch</Switch>
            </div>
        </div>
    </section>

    <section id="sliders">
        <h2>Sliders</h2>
        <caption class="mb-xsmall"
            >UI3 Slider component with variants: delta, range, and stepper</caption
        >

        <div class="mb-xsmall">
            <h3>Delta Variant</h3>
            <caption class="mb-xxsmall">For adjusting values from a default/reference point (like exposure)</caption>
            <div class="flex column gap-xxsmall">
                <div>
                    <Label>At default (value: {sliderValue1})</Label>
                    <Slider bind:value={sliderValue1} variant="delta" min={-100} max={100} defaultValue={0} />
                </div>
                <div>
                    <Label>Negative adjustment (value: {sliderValue2})</Label>
                    <Slider bind:value={sliderValue2} variant="delta" min={-100} max={100} defaultValue={0} />
                </div>
                <div>
                    <Label>Positive adjustment (value: {sliderValue3})</Label>
                    <Slider bind:value={sliderValue3} variant="delta" min={-100} max={100} defaultValue={0} />
                </div>
                <div>
                    <Label>Custom default at 30 (value: {sliderValue4})</Label>
                    <Slider bind:value={sliderValue4} variant="delta" min={0} max={100} defaultValue={30} />
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Range Variant</h3>
            <div class="flex column gap-xxsmall">
                <div>
                    <Label>Range slider (value: {rangeValue1})</Label>
                    <Slider bind:value={rangeValue1} variant="range" min={0} max={100} />
                </div>
                <div>
                    <Label>Range at start (value: {rangeValue2})</Label>
                    <Slider bind:value={rangeValue2} variant="range" min={0} max={100} />
                </div>
                <div>
                    <Label>Range near end (value: {rangeValue3})</Label>
                    <Slider bind:value={rangeValue3} variant="range" min={0} max={100} />
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Stepper Variant</h3>
            <div class="flex column gap-xxsmall">
                <div>
                    <Label>Stepper with step 10 (value: {stepperValue1})</Label>
                    <Slider bind:value={stepperValue1} variant="stepper" min={0} max={100} step={10} />
                </div>
                <div>
                    <Label>Stepper with step 5 (value: {stepperValue2})</Label>
                    <Slider bind:value={stepperValue2} variant="stepper" min={0} max={50} step={5} />
                </div>
                <div>
                    <Label>Stepper at first tick (value: {stepperValue3})</Label>
                    <Slider bind:value={stepperValue3} variant="stepper" min={0} max={100} step={20} />
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Disabled States</h3>
            <div class="flex column gap-xxsmall">
                <div>
                    <Label>Disabled delta</Label>
                    <Slider bind:value={disabledValue1} variant="delta" disabled min={-100} max={100} defaultValue={0} />
                </div>
                <div>
                    <Label>Disabled range</Label>
                    <Slider bind:value={disabledValue2} variant="range" disabled min={0} max={100} />
                </div>
                <div>
                    <Label>Disabled stepper</Label>
                    <Slider bind:value={disabledValue3} variant="stepper" disabled min={0} max={100} step={10} />
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Focus States</h3>
            <div class="flex column gap-xxsmall">
                <div>
                    <Label>Focusable delta (Tab to focus)</Label>
                    <Slider bind:value={focusValue1} variant="delta" tabindex="0" min={-100} max={100} defaultValue={0} />
                </div>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Custom Ranges</h3>
            <div class="flex column gap-xxsmall">
                <div>
                    <Label>Range 0-200 (value: {customValue1})</Label>
                    <Slider bind:value={customValue1} variant="range" min={0} max={200} />
                </div>
                <div>
                    <Label>Range 10-50 (value: {customValue2})</Label>
                    <Slider bind:value={customValue2} variant="range" min={10} max={50} />
                </div>
            </div>
        </div>
    </section>

    <section id="radio-buttons">
        <h2>Radio Buttons</h2>
        <caption class="mb-xsmall"
            >UI3 Radio button component with improved sizing and spacing</caption
        >

        <div class="mb-xsmall">
            <h3>Basic States</h3>
            <div class="flex column gap-xxsmall">
                <Radio bind:group={radioValue} value="a"
                    >Unselected Option</Radio
                >
                <Radio bind:group={radioValue} value="b">Selected Option</Radio>
                <Radio bind:group={radioValue} value="c" disabled
                    >Disabled Option</Radio
                >
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Focus States</h3>
            <div class="flex column gap-xxsmall">
                <Radio bind:group={radioValue} value="d" tabindex="0"
                    >Focusable Option (Tab to focus)</Radio
                >
                <Radio bind:group={radioValue} value="e" tabindex="0"
                    >Another Focusable Option</Radio
                >
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Long Text Example</h3>
            <div class="flex column gap-xxsmall">
                <Radio bind:group={radioValue} value="f">Short option</Radio>
                <Radio bind:group={radioValue} value="g"
                    >Option with really long text content that demonstrates how
                    the radio button handles text wrapping and maintains proper
                    alignment</Radio
                >
            </div>
        </div>
    </section>

    <section id="disclosure">
        <h2>Disclosure panels</h2>
        <caption class="mb-xsmall"
            >Disclosure component with accordion (default), multiple, and standalone modes</caption
        >

        <div class="mb-xsmall">
            <h3>Accordion Mode (Default) - Only One Open</h3>
            <Disclosure>
                <DisclosureItem title="Item 1" open>
                    This is the content for Item 1. Only one item can be open at a time in accordion mode.
                </DisclosureItem>
                <DisclosureItem title="Item 2">
                    This is the content for Item 2. Click to expand.
                </DisclosureItem>
                <DisclosureItem title="Item 3">
                    This is the content for Item 3. When you open this, the others will close.
                </DisclosureItem>
            </Disclosure>
        </div>

        <div class="mb-xsmall">
            <h3>Multiple Mode - Multiple Items Open</h3>
            <Disclosure multiple>
                <DisclosureItem title="Feature A" open>
                    With multiple mode, you can have multiple items open at the same time.
                </DisclosureItem>
                <DisclosureItem title="Feature B" open>
                    This one is also open by default. Both can be open simultaneously!
                </DisclosureItem>
                <DisclosureItem title="Feature C">
                    Click to open this one too. All three can be open at once.
                </DisclosureItem>
            </Disclosure>
        </div>

        <div class="mb-xsmall">
            <h3>Standalone Mode - No Wrapper Needed</h3>
            <div class="flex column gap-xxsmall">
                <DisclosureItem standalone title="Standalone Item 1">
                    This disclosure item works independently without a wrapper component.
                </DisclosureItem>
                <DisclosureItem standalone title="Standalone Item 2" open>
                    Each standalone item manages its own state. This one starts open.
                </DisclosureItem>
                <DisclosureItem standalone title="Standalone Item 3">
                    Perfect for when you need individual disclosure controls.
                </DisclosureItem>
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Section Variant</h3>
            <Disclosure>
                <DisclosureItem title="Section Header 1" section>
                    The section prop makes the header bold for emphasis.
                </DisclosureItem>
                <DisclosureItem title="Section Header 2" section>
                    Useful for distinguishing major sections in your UI.
                </DisclosureItem>
            </Disclosure>
        </div>

        <div class="mb-xsmall">
            <h3>Nested Disclosures - Simple</h3>
            <Disclosure>
                <DisclosureItem title="Parent Item 1">
                    This is the parent content.
                    <Disclosure>
                        <DisclosureItem title="Child Item 1.1">
                            Nested child content here.
                        </DisclosureItem>
                        <DisclosureItem title="Child Item 1.2">
                            Another nested child.
                        </DisclosureItem>
                    </Disclosure>
                </DisclosureItem>
                <DisclosureItem title="Parent Item 2">
                    Parent content without nested items.
                </DisclosureItem>
            </Disclosure>
        </div>

        <div class="mb-xsmall">
            <h3>Nested Disclosures - Multiple Levels</h3>
            <Disclosure>
                <DisclosureItem title="Level 1: Settings" section>
                    Top level settings category.
                    <Disclosure multiple>
                        <DisclosureItem title="Level 2: Display Options">
                            Display settings.
                            <Disclosure>
                                <DisclosureItem title="Level 3: Theme">
                                    Choose between light and dark theme.
                                </DisclosureItem>
                                <DisclosureItem title="Level 3: Layout">
                                    Adjust layout preferences.
                                </DisclosureItem>
                            </Disclosure>
                        </DisclosureItem>
                        <DisclosureItem title="Level 2: Privacy Options">
                            Privacy and security settings.
                            <Disclosure>
                                <DisclosureItem title="Level 3: Data Collection">
                                    Control what data is collected.
                                </DisclosureItem>
                                <DisclosureItem title="Level 3: Permissions">
                                    Manage app permissions.
                                </DisclosureItem>
                            </Disclosure>
                        </DisclosureItem>
                    </Disclosure>
                </DisclosureItem>
                <DisclosureItem title="Level 1: Account" section>
                    Account management options.
                </DisclosureItem>
            </Disclosure>
        </div>

        <div class="mb-xsmall">
            <h3>Nested with Mixed Modes</h3>
            <Disclosure multiple>
                <DisclosureItem title="Multiple Mode Parent 1" open>
                    Parent uses multiple mode (can open multiple parents).
                    <Disclosure>
                        <DisclosureItem title="Accordion Child 1.1">
                            Children use accordion mode (only one child open at a time).
                        </DisclosureItem>
                        <DisclosureItem title="Accordion Child 1.2">
                            This is mutually exclusive with sibling.
                        </DisclosureItem>
                    </Disclosure>
                </DisclosureItem>
                <DisclosureItem title="Multiple Mode Parent 2" open>
                    Both parents can be open.
                    <Disclosure>
                        <DisclosureItem title="Accordion Child 2.1">
                            Child accordion mode again.
                        </DisclosureItem>
                        <DisclosureItem title="Accordion Child 2.2">
                            Independent from Parent 1's children.
                        </DisclosureItem>
                    </Disclosure>
                </DisclosureItem>
            </Disclosure>
        </div>
    </section>

    <section id="tabs" style="background-color: var(--figma-color-bg)">
        <h2>Tabs</h2>
        <caption class="mb-xsmall"
            >UI3 Tabs component with multiple variants and states</caption
        >

        <div class="mb-xsmall">
            <h3>Basic Tabs</h3>
            <div class="flex column gap-xxsmall">
                <Tabs tabs={["Active Tab", "Second tab"]} bind:selectedTab />
                <Tabs
                    tabs={["Active Tab", "Second tab", "Third tab"]}
                    bind:selectedTab
                />
                <Tabs tabs={tabsData} bind:selectedTab />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Single Tab</h3>
            <div class="flex column gap-xxsmall">
                <Tabs tabs={["Single Tab Title"]} bind:selectedTab />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Interactive Example</h3>
            <div class="flex column gap-xxsmall">
                <Tabs tabs={["Tab 1", "Tab 2", "Tab 3"]} bind:selectedTab />
                <Text variant="body-medium"
                    >Selected tab: {selectedTab + 1}</Text
                >
            </div>
        </div>
    </section>

    <section id="icons">
        <h2>UI3 Icons</h2>
        <h3>Icon Component Usage</h3>
        <caption class="mb-xsmall"
            >The Icon component accepts SVG content via the iconName prop. Icons
            default to 24px size. You can pass Figma color variables to the
            color prop. Icons can also accept the spin prop for loading states.</caption
        >

        <div class="mb-xsmall">
            <h4>Color Variations</h4>
            <div class="flex row mb-xsmall">
                <Icon iconName={IconCheck} color="--figma-color-icon" />
                <Icon
                    iconName={IconCheck}
                    color="--figma-color-icon-secondary"
                />
                <Icon
                    iconName={IconCheck}
                    color="--figma-color-icon-tertiary"
                />
                <Icon
                    iconName={IconCheck}
                    color="--figma-color-icon-disabled"
                />
                <Icon iconName={IconCheck} color="--figma-color-icon-brand" />
                <Icon iconName={IconCheck} color="--figma-color-icon-danger" />
                <Icon iconName={IconCheck} color="--figma-color-icon-success" />
                <Icon iconName={IconCheck} color="--figma-color-icon-warning" />
            </div>
        </div>

        <div class="mb-xsmall">
            <h4>Text Icons</h4>
            <div class="flex row mb-xsmall">
                <Icon iconText="W" />
                <Icon iconText="H" color="--figma-color-icon-secondary" />
                <Icon iconText="#" color="--figma-color-icon-brand" />
                <Icon iconText="@" color="--figma-color-icon-danger" />
                <Icon iconText="→" color="--figma-color-icon-brand" spin />
            </div>
        </div>

        <div class="mb-xsmall">
            <h4>24px Icons (Default)</h4>
            <div class="flex row flex-wrap mb-xsmall">
                <Icon iconName={IconCheck} />
                <Icon iconName={IconClose} />
                <Icon iconName={IconPlus} />
                <Icon iconName={IconMinus} />
                <Icon iconName={IconSettings} />
                <Icon iconName={IconSearch} />
                <Icon iconName={IconTrash} />
                <Icon iconName={IconWarning} />
                <Icon iconName={IconArrow} />
                <Icon iconName={IconChevronRight} />
                <Icon iconName={IconChevronDown} />
                <Icon iconName={IconChevronUp} />
            </div>
        </div>

        <div class="mb-xsmall">
            <h4>16px Icons (Compact)</h4>
            <div class="flex row flex-wrap mb-xsmall">
                <Icon iconName={Icon16Check} />
                <Icon iconName={Icon16Close} />
                <Icon iconName={Icon16Plus} />
                <Icon iconName={Icon16ChevronRight} />
                <Icon iconName={Icon16ChevronDown} />
            </div>
        </div>
    </section>

    <section id="icon-buttons">
        <h2>Icon Buttons</h2>
        <caption class="mb-xsmall"
            >UI3 IconButton component with Default and Secondary variants</caption
        >

        <div class="mb-xsmall">
            <h3>Default Variant</h3>
            <div class="flex row gap-xxsmall">
                <IconButton iconName={IconSettings} variant="default" />
                <IconButton
                    iconName={IconSettings}
                    variant="default"
                    disabled
                />
                <IconButton iconName={IconPlus} variant="default" />
                <IconButton iconName={IconTrash} variant="default" />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Secondary Variant</h3>
            <div class="flex row gap-xxsmall">
                <IconButton iconName={IconSettings} variant="secondary" />
                <IconButton
                    iconName={IconSettings}
                    variant="secondary"
                    disabled
                />
                <IconButton iconName={IconPlus} variant="secondary" />
                <IconButton iconName={IconTrash} variant="secondary" />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Mixed Examples</h3>
            <div class="flex row gap-xxsmall">
                <IconButton iconName={IconSettings} variant="default" />
                <IconButton iconName={IconSettings} variant="secondary" />
                <IconButton iconName={IconPlus} variant="default" />
                <IconButton iconName={IconPlus} variant="secondary" />
                <IconButton iconName={IconTrash} variant="default" />
                <IconButton iconName={IconTrash} variant="secondary" />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Custom Icon Colors</h3>
            <caption class="mb-xxsmall">IconButton now supports custom icon colors via the iconColor prop</caption>
            <div class="flex row gap-xxsmall">
                <IconButton iconName={IconCheck} variant="default" iconColor="--figma-color-icon-brand" />
                <IconButton iconName={IconSettings} variant="default" iconColor="--figma-color-icon-success" />
                <IconButton iconName={IconWarning} variant="default" iconColor="--figma-color-icon-warning" />
                <IconButton iconName={IconTrash} variant="default" iconColor="--figma-color-icon-danger" />
                <IconButton iconName={IconPlus} variant="secondary" iconColor="--figma-color-icon-brand" />
                <IconButton iconName={IconCheck} variant="secondary" iconColor="--figma-color-icon-success" />
            </div>
        </div>
    </section>

    <section id="input-fields">
        <h2>Input Fields</h2>
        <caption class="mb-xsmall"
            >UI3 Input component with size variants (default: 24px, large: 32px)</caption
        >

        <div class="mb-xsmall">
            <h3>Default Size (24px)</h3>
            <div class="flex column gap-xxsmall">
                <Input placeholder="Enter text here..." />
                <Input value="This is an example with a value" />
                <Input value="This is a disabled input" disabled />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Large Size (32px)</h3>
            <div class="flex column gap-xxsmall">
                <Input size="large" placeholder="Enter text here..." />
                <Input size="large" value="This is an example with a value" />
                <Input size="large" value="This is a disabled input" disabled />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>With Icons</h3>
            <div class="flex column gap-xxsmall">
                <Input iconName={IconSearch} placeholder="Search..." />
                <Input
                    size="large"
                    iconName={IconSearch}
                    placeholder="Large search..."
                />
                <Input iconText="W" value="Width input with text icon" />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Validation States</h3>
            <div class="flex column gap-xxsmall">
                <Input value="This is an invalid example" invalid="true" />
                <Input
                    size="large"
                    value="Large invalid example"
                    invalid="true"
                />
            </div>
        </div>
    </section>

    <section id="textarea-fields">
        <h2>Textarea Fields</h2>
        <caption class="mb-xsmall"
            >UI3 Textarea component with multi-line text input</caption
        >

        <div class="mb-xsmall">
            <h3>Basic States</h3>
            <div class="flex column gap-xxsmall">
                <Textarea placeholder="Enter multi-line text here..." />
                <Textarea
                    value="This is an example with a value\nthat spans multiple lines"
                />
                <Textarea value="This is a disabled textarea" disabled />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Validation States</h3>
            <div class="flex column gap-xxsmall">
                <Textarea
                    value="This is an invalid example\nwith multiple lines"
                    invalid="true"
                />
                <Textarea placeholder="Valid textarea with placeholder" />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Different Sizes</h3>
            <div class="flex column gap-xxsmall">
                <Textarea rows="2" placeholder="Small textarea (2 rows)" />
                <Textarea rows="4" placeholder="Medium textarea (4 rows)" />
                <Textarea rows="6" placeholder="Large textarea (6 rows)" />
            </div>
        </div>
    </section>

    <section id="chips">
        <h2>Chip Components</h2>
        <caption class="mb-xsmall"
            >UI3 Chip component for tags and labels that can appear inside input
            fields</caption
        >

        <div class="mb-xsmall">
            <h3>Basic Chips</h3>
            <div class="flex row gap-xxsmall flex-wrap">
                <Chip label="Default Chip" />
                <Chip label="With Icon" iconName={IconSettings} />
                <Chip label="Component Chip" variant="component" closable/> 
                <Chip label="Closable" closable />
                <Chip
                    label="With Icon & Close"
                    iconName={IconSettings}
                    closable
                />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>States</h3>
            <div class="flex row gap-xxsmall flex-wrap">
                <Chip label="Focused" focused />
                <Chip label="Disabled" disabled />
                <Chip label="Focused & Closable" focused closable />
                <Chip label="Disabled & Closable" disabled closable />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Long Text</h3>
            <div class="flex row gap-xxsmall flex-wrap">
                <Chip label="Short" />
                <Chip
                    label="This is a very long chip label that demonstrates text truncation"
                />
                <Chip label="Long with Icon" iconName={IconSearch} />
                <Chip label="Long with Close" closable />
            </div>
        </div>
    </section>

    <section id="labels-sections">
        <h2>Labels</h2>
        <Label>Label goes here</Label>
    </section>

    <section id="dropdown">
        <h2>Dropdown</h2>
        <caption class="mb-xsmall"
            >UI3 Dropdown component (button + menu).</caption
        >

        <div class="mb-xsmall">
            <h3>Basic States</h3>
            <div class="flex row gap-xxsmall">
                <Dropdown
                    placeholder="Please make a selection"
                    bind:menuItems={menuItemsExample1}
                    class="mb-xsmall"
                />
                <Dropdown
                    bind:menuItems={menuItemsExample2}
                    class="mb-xsmall"
                />
                <Dropdown
                    bind:menuItems={menuItemsExample4}
                    iconName={IconSettings}
                    class="mb-xsmall"
                />
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>With Groups and Headings</h3>
            <Dropdown
                bind:menuItems={menuItemsExample3}
                showGroupLabels
                class="mb-xsmall"
            />
        </div>

        <div class="mb-xsmall">
            <h3>Interactive Example</h3>
            <div class="flex row gap-xxsmall">
                <Dropdown
                    bind:menuItems={menuItemsExample0}
                    class="mb-xsmall"
                />
                <Button
                    variant="secondary"
                    class="mr-xxsmall mb-xsmall"
                    on:click={populateMenu}>Populate menu</Button
                >
            </div>
        </div>
    </section>

    <section id="menu">
        <h2>Menu</h2>
        <caption class="mb-xsmall"
            >Standalone Menu component (can attach to any trigger). Use with
            IconButton, custom buttons, or context menus.</caption
        >

        <div class="mb-xsmall">
            <h3>Menu with Icon Button</h3>
            <div class="flex row gap-xxsmall align-center">
                <IconButton
                    iconName={IconSettings}
                    bind:element={menuAnchor1}
                    on:click={() => (menuOpen1 = !menuOpen1)}
                />
            <Menu
                bind:isOpen={menuOpen1}
                menuItems={menuItemsExample1}
                anchorElement={menuAnchor1}
                position="auto"
                on:select={handleMenuSelect1}
                on:close={() => (menuOpen1 = false)}
            />
                <span class="text-small"
                    >Selected: {selectedItem1?.label || "None"}</span
                >
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Menu with Custom Trigger</h3>
            <div class="flex row gap-xxsmall align-center">
                <Button
                    variant="secondary"
                    bind:element={menuAnchor2}
                    on:click={() => (menuOpen2 = !menuOpen2)}
                    >Custom Menu</Button
                >
                <span class="text-small"
                    >Selected: {selectedItem2?.label || "None"}</span
                >
            </div>
            <Menu
                bind:isOpen={menuOpen2}
                menuItems={menuItemsExample2}
                showGroupLabels
                anchorElement={menuAnchor2}
                on:select={handleMenuSelect2}
                on:close={() => (menuOpen2 = false)}
            />
        </div>

        <div class="mb-xsmall">
            <h3>Menu with Groups and Headings</h3>
            <div class="flex row gap-xxsmall align-center">
                <Button
                    variant="ghost"
                    bind:element={menuAnchor3}
                    on:click={() => (menuOpen3 = !menuOpen3)}
                    >Show Groups</Button
                >
                <span class="text-small"
                    >Selected: {selectedItem3?.label || "None"}</span
                >
            </div>
            <Menu
                bind:isOpen={menuOpen3}
                menuItems={menuItemsExample3}
                showGroupLabels
                anchorElement={menuAnchor3}
                on:select={handleMenuSelect3}
                on:close={() => (menuOpen3 = false)}
            />
        </div>

        <div class="mb-xsmall">
            <h3>Menu with Custom Button</h3>
            <div class="flex row gap-xxsmall align-center">
                <Button
                    size="wide"
                    variant="primary"
                    bind:element={menuAnchor4}
                    on:click={() => (menuOpen4 = !menuOpen4)}
                    >Wide Button Trigger</Button
                >
                <Menu
                    bind:isOpen={menuOpen4}
                    menuItems={menuItemsExample1}
                    anchorElement={menuAnchor4}
                    on:select={handleMenuSelect4}
                    on:close={() => (menuOpen4 = false)}
                />
                <span class="text-small"
                    >Selected: {selectedItem4?.label || "None"}</span
                >
            </div>
        </div>

        <div class="mb-xsmall">
            <h3>Manual Positioning Test Grid</h3>
            <caption class="mb-xsmall">Testing manual positioning options in different viewport locations</caption>
            
            <!-- Bottom-left positioning -->
            <div class="mb-xsmall">
                <h4>Bottom-Left Positioning</h4>
                <div class="flex row gap-xxsmall align-center">
                    <IconButton
                        iconName={IconSettings}
                        bind:element={menuAnchor5}
                        on:click={() => (menuOpen5 = !menuOpen5)}
                    />
                    <span class="text-small">Selected: {selectedItem5?.label || "None"}</span>
                </div>
                <Menu
                    bind:isOpen={menuOpen5}
                    menuItems={menuItemsExample1}
                    anchorElement={menuAnchor5}
                    position="bottom-left"
                    on:select={handleMenuSelect5}
                    on:close={() => (menuOpen5 = false)}
                />
            </div>

            <!-- Bottom-right positioning -->
            <div class="mb-xsmall">
                <h4>Bottom-Right Positioning</h4>
                <div class="flex row gap-xxsmall align-center">
                    <IconButton
                        iconName={IconSettings}
                        bind:element={menuAnchor1}
                        on:click={() => (menuOpen1 = !menuOpen1)}
                    />
                    <span class="text-small">Selected: {selectedItem1?.label || "None"}</span>
                </div>
                <Menu
                    bind:isOpen={menuOpen1}
                    menuItems={menuItemsExample1}
                    anchorElement={menuAnchor1}
                    position="bottom-right"
                    on:select={handleMenuSelect1}
                    on:close={() => (menuOpen1 = false)}
                />
            </div>

            <!-- Top-left positioning -->
            <div class="mb-xsmall">
                <h4>Top-Left Positioning</h4>
                <div class="flex row gap-xxsmall align-center">
                    <IconButton
                        iconName={IconSettings}
                        bind:element={menuAnchor6}
                        on:click={() => (menuOpen6 = !menuOpen6)}
                    />
                    <span class="text-small">Selected: {selectedItem6?.label || "None"}</span>
                </div>
                <Menu
                    bind:isOpen={menuOpen6}
                    menuItems={menuItemsExample1}
                    anchorElement={menuAnchor6}
                    position="top-left"
                    on:select={handleMenuSelect6}
                    on:close={() => (menuOpen6 = false)}
                />
            </div>

            <!-- Top-right positioning -->
            <div class="mb-xsmall">
                <h4>Top-Right Positioning</h4>
                <div class="flex row gap-xxsmall align-center justify-end">
                    <IconButton
                        iconName={IconSettings}
                        bind:element={menuAnchor7}
                        on:click={() => (menuOpen7 = !menuOpen7)}
                    />
                    <span class="text-small">Selected: {selectedItem7?.label || "None"}</span>
                </div>
                <Menu
                    bind:isOpen={menuOpen7}
                    menuItems={menuItemsExample1}
                    anchorElement={menuAnchor7}
                    position="top-right"
                    on:select={handleMenuSelect7}
                    on:close={() => (menuOpen7 = false)}
                />
            </div>

            <!-- Nested container test -->
            <div class="mb-xsmall">
                <h4>Nested Container Test (Bottom-Left)</h4>
                <div style="position: relative; border: 2px dashed #666; padding: 20px; margin: 10px 0;">
                    <div style="position: relative; border: 1px solid #999; padding: 15px; margin: 10px;">
                        <div class="flex row gap-xxsmall align-center">
                            <IconButton
                                iconName={IconSettings}
                                bind:element={menuAnchor2}
                                on:click={() => (menuOpen2 = !menuOpen2)}
                            />
                            <span class="text-small">Nested: {selectedItem2?.label || "None"}</span>
                        </div>
                        <Menu
                            bind:isOpen={menuOpen2}
                            menuItems={menuItemsExample1}
                            anchorElement={menuAnchor2}
                            position="bottom-left"
                            on:select={handleMenuSelect2}
                            on:close={() => (menuOpen2 = false)}
                        />
                    </div>
                </div>
            </div>

            <!-- Nested Menu Example -->
            <div class="mb-xsmall">
                <h4>Nested Menu (Sub-Menus)</h4>
                <caption class="mb-xsmall">Hover over items with chevron icons to open sub-menus. Supports unlimited nesting levels.</caption>
                <div class="flex row gap-xxsmall align-center">
                    <IconButton
                        iconName={IconSettings}
                        bind:element={menuAnchor9}
                        on:click={() => (menuOpen9 = !menuOpen9)}
                    />
                    <span class="text-small">Selected: {selectedItem9?.label || "None"}</span>
                </div>
                <Menu
                    bind:isOpen={menuOpen9}
                    menuItems={menuItemsNested}
                    anchorElement={menuAnchor9}
                    position="bottom-left"
                    on:select={handleMenuSelect9}
                    on:close={() => (menuOpen9 = false)}
                />
            </div>
        </div>
    </section>
</div>

<style>
    .wrapper {
        padding: 24px;
    }

    h1 {
        font-size: 24px;
        padding: 0;
        margin: 0 0 24px 0;
    }

    h2 {
        font-size: 16px;
        padding: 0;
        margin: 0 0 16px 0;
    }

    h3 {
        font-weight: normal;
        font-size: 12px;
        padding: 0;
        margin: 0 0 8px 0;
    }

    caption {
        font-size: 11px;
        color: var(--figma-color-text);
        display: block;
        text-align: left;
    }

    section {
        border-bottom: 1px solid var(--black);
        padding-bottom: var(--size-medium);
        margin-bottom: var(--size-medium);
        background-color: var(--figma-color-bg);
    }
    section:last-child {
        border-bottom: 1px solid transparent;
        margin-bottom: 0px;
    }

    .text-small {
        font-size: var(--font-size-small);
        color: var(--figma-color-text-secondary);
    }

    .align-center {
        align-items: center;
    }

    .justify-end {
        justify-content: flex-end;
    }

    h4 {
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: var(--figma-color-text);
    }

    /* Anchor Navigation Styles */
    .anchor-nav {
        position: fixed;
        top: 24px;
        right: 24px;
        width: 200px;
        max-height: calc(100vh - 48px);
        background-color: var(--figma-color-bg);
        border: 1px solid var(--figma-color-border);
        border-radius: var(--border-radius-medium);
        box-shadow: var(--elevation-300);
        z-index: 1000;
        overflow-y: auto;
    }

    .nav-content {
        padding: var(--size-xxsmall);
    }

    .nav-content h3 {
        font-size: var(--font-size-medium);
        font-weight: var(--font-weight-strong);
        color: var(--figma-color-text);
        margin: 0 0 var(--size-xxsmall) 0;
        padding: var(--size-xxxsmall) var(--size-xxsmall);
        border-bottom: 1px solid var(--figma-color-border);
    }

    .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .nav-item {
        margin: 0;
    }

    .nav-link {
        display: block;
        width: 100%;
        padding: var(--size-xxxsmall) var(--size-xxsmall);
        background: none;
        border: none;
        text-align: left;
        font-size: var(--font-size-small);
        color: var(--figma-color-text-secondary);
        cursor: pointer;
        border-radius: var(--border-radius-small);
        transition: all 0.15s ease;
        text-decoration: none;
    }

    .nav-link:hover {
        background-color: var(--figma-color-bg-hover);
        color: var(--figma-color-text);
    }

    .nav-link.active {
        background-color: var(--figma-color-bg-selected);
        color: var(--figma-color-text);
        font-weight: var(--font-weight-strong);
    }

    .nav-link:focus {
        outline: 2px solid var(--figma-color-border-selected);
        outline-offset: -2px;
    }

    /* Responsive adjustments */
    @media (max-width: 1200px) {
        .anchor-nav {
            position: relative;
            top: auto;
            right: auto;
            width: 100%;
            max-height: none;
            margin-bottom: var(--size-medium);
        }
    }
</style>
