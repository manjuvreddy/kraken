import {Inject, Injectable, OnDestroy} from '@angular/core';
import {KeyBinding, KeyBindingsService} from 'projects/tools/src/lib/key-bindings.service';
import {STORAGE_ID} from 'projects/storage/src/lib/storage-id';
import {StorageTreeControlService} from 'projects/storage/src/lib/storage-tree/storage-tree-control.service';
import * as _ from 'lodash';
import {StorageNode} from 'projects/storage/src/lib/entities/storage-node';
import {
  STORAGE_ROOT_NODE,
  StorageTreeDataSourceService
} from 'projects/storage/src/lib/storage-tree/storage-tree-data-source.service';

@Injectable()
export class StorageKeyBindingService implements OnDestroy {

  private keyBindings: KeyBinding[] = [];

  constructor(
    public treeControl: StorageTreeControlService,
    @Inject(STORAGE_ID) public id: string,
    @Inject(STORAGE_ROOT_NODE) private readonly rootNode: StorageNode,
    private keys: KeyBindingsService,
    private dataSource: StorageTreeDataSourceService) {
    this.keyBindings.push(new KeyBinding(['ArrowUp', 'Up'], this.upSelection.bind(this), id));
    this.keyBindings.push(new KeyBinding(['ArrowDown', 'Down'], this.downSelection.bind(this), id));
    this.keyBindings.push(new KeyBinding(['shift + ArrowUp', 'shift + Up'], this.upMultiSelection.bind(this), id));
    this.keyBindings.push(new KeyBinding(['shift + ArrowDown', 'shift + Down'], this.downMultiSelection.bind(this), id));
    this.keyBindings.forEach(binding => {
      this.keys.add([binding]);
    });
  }

  ngOnDestroy() {
    this.keyBindings.forEach(binding => this.keys.remove([binding]));
  }

  public upSelection(): boolean {
    // Find index of the current selection or the first node selected for multiple
    // Select index -1 if it isn't the root
    const nodes = this.dataSource.data;
    const lastIndex = _.indexOf(nodes, this.treeControl._lastSelection);
    if (lastIndex > 0) {
      const nodeToSelect = this.selectNextOpen(lastIndex, index => index - 1);
      this.treeControl.selectOne(nodeToSelect);
      return true;
    }
    return false;
  }

  public upMultiSelection(): boolean {
    // Find index of the current selection or the first node selected for multiple
    // Select index -1 if it isn't the root
    const nodes = this.dataSource.data;
    const lastIndex = _.indexOf(nodes, this.treeControl._lastSelection);
    if (lastIndex > 0) {
      const nodeToSelect = this.selectNextOpen(lastIndex, index => index - 1);
      if (this.treeControl.isSelected(nodeToSelect)) {
        this.treeControl.deselectNode(nodes[lastIndex], nodeToSelect);
      } else {
        this.treeControl.selectNode(nodeToSelect);
      }
      return true;
    }
    return false;
  }

  public downSelection(): boolean {
    // Find index of the current selection or the first node selected for multiple
    // Select index -1 if it isn't the root
    const nodes = this.dataSource.data;
    const lastIndex = _.indexOf(nodes, this.treeControl._lastSelection);
    if (lastIndex < nodes.length - 1) {
      this.treeControl.selectOne(this.selectNextOpen(lastIndex, index => index + 1));
      return true;
    }
    return false;
  }

  public downMultiSelection(): boolean {
    // Find index of the current selection or the first node selected for multiple
    // Select index -1 if it isn't the root
    const nodes = this.dataSource.data;
    const lastIndex = _.indexOf(nodes, this.treeControl._lastSelection);
    if (lastIndex < nodes.length - 1) {
      const nextNode = this.selectNextOpen(lastIndex, index => index + 1);
      if (this.treeControl.isSelected(nextNode)) {
        this.treeControl.deselectNode(nodes[lastIndex], nextNode);
      } else {
        this.treeControl.selectNode(nextNode);
      }
      return true;
    }
    return false;
  }

  private selectNextOpen(index: number, getNextIndex: (index: number) => number): StorageNode {
    const nodes = this.dataSource.data;
    const nodeToSelect = nodes[getNextIndex(index)];
    if (index > 0 && index < nodes.length - 1) {
      const parent = this.dataSource.parentNode(nodeToSelect);
      if (parent.path !== this.rootNode.path && !this.treeControl.isExpanded(parent)) {
        return this.selectNextOpen(getNextIndex(index), getNextIndex);
      }
    }
    return nodeToSelect;
  }

}
