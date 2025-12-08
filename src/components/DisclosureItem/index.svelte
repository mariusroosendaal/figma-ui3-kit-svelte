<script context="module">
    export const disclosure = {};
</script>

<script>

    import { getContext, onMount, createEventDispatcher, hasContext } from 'svelte';
    import Icon from './../Icon/index.svelte';
    import ChevronRight from './../../icons/16/icon.16.chevron.right.svg';
    import ChevronDown from './../../icons/16/icon.16.chevron.down.svg';

    const dispatch = createEventDispatcher();

    export let uniqueId = 'disclosureItem--' + ((Math.random() * 10000000).toFixed(0)).toString();
    export let title = null;
    export let expanded = false;
    export let section = false;
    export let open = false;
    export let standalone = false;

    let className = '';
    export { className as class };

    // Check if we're inside a Disclosure wrapper
    const inDisclosureContext = hasContext(disclosure);
    const isStandalone = standalone || !inDisclosureContext;

    let context = inDisclosureContext ? getContext(disclosure) : null;
    let selected = context?.selected;
    let internalExpanded = open;

    // Internal expanded state (not the exported prop)
    let isExpanded = false;

    // Reactive statement to determine expanded state
    $: {
        if (isStandalone) {
            // Standalone mode: use internal state
            isExpanded = internalExpanded;
            expanded = isExpanded; // Sync to exported prop for bind:expanded
        } else if (selected) {
            // Context mode: check if in Set
            isExpanded = $selected.has(uniqueId);
        } else {
            isExpanded = false;
        }
    }
    
    // Set initial open state
    onMount(() => {
        if (open && !isStandalone && selected) {
            selected.update(set => {
                const newSet = new Set(set);
                newSet.add(uniqueId);
                return newSet;
            });
        }
    });

    // Click handler
    function handleClick() {
        if (isStandalone) {
            // Standalone mode: toggle internal state
            internalExpanded = !internalExpanded;
            dispatch('toggle', { expanded: internalExpanded, uniqueId });
        } else if (context) {
            // Context mode: use the wrapper's click handler
            context.clickHandler(uniqueId);
        }
    }

</script>

<li {open} {title} id={uniqueId} class="{className}" class:expanded={isExpanded}>
    <div 
        on:click={handleClick}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
        role="button"
        tabindex="0"
        class="header" 
        class:section={section}
    >
        <div class="icon">
            {#if isExpanded}
                <Icon iconName={ChevronDown} size={16}/>
            {:else}
                <Icon iconName={ChevronRight} size={16}/>
            {/if}
        </div>
        <div class="title">{title}</div>
    </div>
    <div class="content">
        <slot />
    </div>
</li>

<style>

    li {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .header {
        display: flex;
        align-items: center;
        height: var(--size-small);
        font-size: var(--body-medium-font-size);
        font-weight: var(--body-medium-font-weight);
        letter-spacing: var(--body-medium-letter-spacing);
        line-height: var(--body-medium-line-height);
        color: var(--figma-color-text);
        border-radius: var(--border-radius-medium);
        border: 1px solid transparent;
        gap: var(--size-xxsmall);
        padding: 0 var(--size-xxsmall);
        cursor: pointer;
    }
    .header:hover {
        background: var(--figma-color-bg-secondary)
    }
    .header:hover .icon {
        opacity: 0.9;
    }

    .title {
        margin-left: -4px;
        user-select: none;
    }

    .icon {
        margin-left: -4px;
        opacity: 0.3;
    }
    .expanded .icon {
        opacity: 0.8;
    }

    .section {
        font-weight: var(--font-weight-strong);
    }

    .content {
        font-size: var(--body-medium-font-size);
        font-weight: var(--body-medium-font-weight);
        letter-spacing: var(--body-medium-letter-spacing);
        line-height: var(--body-medium-line-height);
        color: var(--figma-color-text);
        padding: var(--size-xxsmall) 0 var(--size-xxsmall) var(--size-small);
        display: none;
        pointer-events: none;
    }
    
    .expanded > .content {
        display: block;
        pointer-events: auto;
    }

</style>