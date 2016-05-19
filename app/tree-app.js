import React from 'react';

function addItem(tree, id, newNode) {
  return tree.map((node) => {
    if (node.id === id) {
      node.children.push(newNode);
    } else {
      node.children = addItem(node.children, id, newNode);
    }
    return node;
  });
}

function toList(tree) {
  const queue = tree.slice().map(node => ({
    level: 1,
    id: node.id,
    name: node.name,
    children: node.children
  }));
  const result = [];
  while (queue.length) {
    const head = queue.shift();
    queue.unshift(...head.children.map(node => ({
      level: head.level + 1,
      id: node.id,
      name: node.name,
      children: node.children
    })));
    result.push(head);
  }
  return result;
}

function repeat(str, count) {
  let accum = '';
  while (count--) {
    accum += str;
  }
  return accum;
}

export default class TreeApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextId: 1,
      items: props.items || [],
      inputValue: ''
    };
  }

  onButtonClick() {
    let items;
    const newNode = {
      id: this.state.nextId++,
      name: this.state.inputValue,
      children: []
    };
    if (this.state.selectedItem) {
      items = addItem(this.state.items, this.state.selectedItem, newNode);
    } else {
      items = [...this.state.items, newNode];
    }
    this.setState({
      items,
      inputValue: ''
    });
  }

  onInputChange(event) {
    this.setState({inputValue: event.target.value});
  }

  onSelect(event) {
    this.setState({selectedItem: parseInt(event.target.value, 10)});
  }

  render() {
    let options = toList(this.state.items)
          .map(({level, name, id}) => (<option value={id}>{repeat('-', level) + ' ' + name}</option>));

    return (
      <div>
        <select onChange={this.onSelect.bind(this)}>
          <option value={0}>root</option>
          {options}
        </select>
        <input onChange={this.onInputChange.bind(this)} value={this.state.inputValue} />
        <button onClick={this.onButtonClick.bind(this)} />
        <ListItems items={this.state.items} />
      </div>
    );
  }
}

class ListItems extends React.Component {
  render() {
    let items = this.props.items.map(({name, id, children}) => {
      return (<li key={id}><span>{name}</span><ListItems items={children} /></li>);
    });
    return (<ul>{items}</ul>);
  }
}
