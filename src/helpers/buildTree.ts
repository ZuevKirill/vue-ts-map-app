type TreeNode = {
  ID?: string,
  Name?: string,
  type?: string,
  key?: string;
  label?: string;
  children?: TreeNode[];
  data?: any;
};

export function buildTree(groups: any[], devices: any[]): TreeNode[] {
    const groupMap = new Map<string, TreeNode>()
    const root: TreeNode[] = []
  
    for (const group of groups) {
      const node: TreeNode = {
        ID: group.ID,
        Name: group.Name,
        type: 'group',
        children: [],
      }
  
      groupMap.set(group.ID, node)
  
      if (group.ParentID && groupMap.has(group.ParentID)) {
        groupMap.get(group.ParentID)!.children!.push(node)
      } else {
        root.push(node)
      }
    }
  
    for (const device of devices) {
      const deviceNode: TreeNode = {
        ID: device.ID,
        Name: device.Name,
        type: 'device',
        data: device,
      }
  
      if (groupMap.has(device.ParentID)) {
        groupMap.get(device.ParentID)!.children!.push(deviceNode)
      } else {
        // если вдруг есть "висящие" устройства
        root.push(deviceNode)
      }
    }
  
    return root
  }