import Tree from './index.svelte';
import WideContainer from '../../../.storybook/WideContainer.svelte';
import IconPage from '../../icons/16/icon.16.page.svg';

export default {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['none', 'single', 'check'] },
    nodes: { control: 'object' },
    expanded: { control: 'object', description: 'Open parent ids; null opens all' },
    selected: { control: 'text' },
    checked: { control: 'object' },
    disabled: { control: 'boolean' },
    class: { table: { disable: true } },
  },
};

const pages = [
  {
    id: 'foundations',
    label: 'Foundations',
    detail: '3 pages',
    children: [
      { id: 'color', label: 'Color', iconName: IconPage },
      { id: 'type', label: 'Typography', iconName: IconPage },
      { id: 'space', label: 'Spacing', iconName: IconPage },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    detail: '2 pages',
    children: [
      { id: 'buttons', label: 'Buttons', iconName: IconPage },
      { id: 'inputs', label: 'Inputs', iconName: IconPage },
    ],
  },
  { id: 'cover', label: 'Cover', iconName: IconPage },
];

const render = (/** @type {Record<string, any>} */ args) => ({
  Component: WideContainer,
  props: { width: '260px', childComponent: Tree, childProps: args },
});

// Ticking pages to scan: parents show all, some or none of their pages
export const Check = {
  args: { nodes: pages, mode: 'check', checked: ['color', 'type'], ariaLabel: 'Pages' },
  render,
};
export const Single = {
  args: { nodes: pages, mode: 'single', selected: 'inputs', ariaLabel: 'Pages' },
  render,
};
export const Browse = {
  args: {
    ariaLabel: 'JSON',
    expanded: ['user'],
    nodes: [
      {
        id: 'user',
        label: 'user',
        detail: 'object',
        children: [
          { id: 'name', label: 'name', detail: '"Lizzy"' },
          { id: 'age', label: 'age', detail: '32' },
          {
            id: 'tags',
            label: 'tags',
            detail: 'array',
            children: [{ id: 't0', label: '0', detail: '"design"' }],
          },
        ],
      },
    ],
  },
  render,
};
