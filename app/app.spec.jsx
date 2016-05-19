import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

import TreeApp from './tree-app';

describe('TreeApp', function() {
  let rootEl;

  beforeEach(function () {
    rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
  });

  afterEach(function () {
    rootEl.parentNode.removeChild(rootEl);
  });


  it('should have no items by default', function() {
    expect(treeApp(rootEl).getItems()).toEqual([]);
  });

  it('should add new item', function () {
    expect(treeApp(rootEl).addItem('test').getItems())
      .toEqual([{name: 'test', children: []}]);
  });

  it('should reset input after adding new item', function () {
    expect(treeApp(rootEl).addItem('test').getInput()).toBe('');
  });

  it('should add child item', function () {
    expect(treeApp(rootEl).addItem('foo').selectItem(1).addItem('bar').getItems())
      .toEqual([
        {
          name: 'foo',
          children: [
            {
              name: 'bar',
              children: []
            }
          ]
        }
      ]);
  });

  it('should list all nodes as options', function () {
    const items = [{
      id: 1,
      name: 'foo',
      children: [{
        id: 2,
        name: 'bar',
        children: [{
          id: 3,
          name: 'baz',
          children: []
        }]
      }]
    }];
    expect(treeApp(rootEl, items).getOptions()).toEqual([
      'root',
      '- foo',
      '-- bar',
      '--- baz'
    ]);

  });

  function treeApp(el, items = []) {
    function render() {
      ReactDOM.render(<TreeApp items={items} />, el);
    }

    function toItem(el) {
      return {
        name: el.querySelector('span').textContent,
        children: [].slice.call(el.querySelector('ul').children).map(toItem)
      };
    }

    return {
      addItem(name, id) {
        render();
        el.querySelector('input').value = name;
        ReactTestUtils.Simulate.change(el.querySelector('input'));
        el.querySelector('button').click();
        return this;
      },
      getItems() {
        render();
        return [].slice.call(el.querySelector('ul').children).map(toItem);
      },
      getOptions() {
        render();
        return [].slice.call(el.querySelectorAll('option')).map(node => node.textContent);
      },
      getInput() {
        render();
        return el.querySelector('input').value;
      },
      selectItem(id) {
        render();
        let select = el.querySelector('select');
        select.value = id;
        ReactTestUtils.Simulate.change(select);
        return this;
      }
    };
  }
});

