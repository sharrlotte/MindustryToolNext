import { Node, NodePositionChange, XYPosition } from '@xyflow/react';

type GetHelperLinesResult = {
  horizontal?: number;
  vertical?: number;
  snapPosition: Partial<XYPosition>;
};

export function getHelperLines(change: NodePositionChange, nodes: Node[], distance = 5): GetHelperLinesResult {
  const defaultResult: GetHelperLinesResult = {
    horizontal: undefined,
    vertical: undefined,
    snapPosition: { x: undefined, y: undefined },
  };

  const nodeA = nodes.find((node) => node.id === change.id);
  if (!nodeA || !change.position) {
    return defaultResult;
  }

  const nodeABounds = {
    left: change.position.x,
    right: change.position.x + (nodeA.width ?? 0),
    top: change.position.y,
    bottom: change.position.y + (nodeA.height ?? 0),
    width: nodeA.width ?? 0,
    height: nodeA.height ?? 0,
  };

  let horizontalDistance = distance;
  let verticalDistance = distance;

  return nodes
    .filter((node) => node.id !== nodeA.id)
    .reduce<GetHelperLinesResult>((result, nodeB) => {
      const nodeBBounds = {
        left: nodeB.position.x,
        right: nodeB.position.x + (nodeB.width ?? 0),
        top: nodeB.position.y,
        bottom: nodeB.position.y + (nodeB.height ?? 0),
        width: nodeB.width ?? 0,
        height: nodeB.height ?? 0,
      };

      const distances = {
        distanceLeftLeft: Math.abs(nodeABounds.left - nodeBBounds.left),
        distanceRightRight: Math.abs(nodeABounds.right - nodeBBounds.right),
        distanceLeftRight: Math.abs(nodeABounds.left - nodeBBounds.right),
        distanceRightLeft: Math.abs(nodeABounds.right - nodeBBounds.left),
        distanceTopTop: Math.abs(nodeABounds.top - nodeBBounds.top),
        distanceBottomTop: Math.abs(nodeABounds.bottom - nodeBBounds.top),
        distanceBottomBottom: Math.abs(nodeABounds.bottom - nodeBBounds.bottom),
        distanceTopBottom: Math.abs(nodeABounds.top - nodeBBounds.bottom),
      };

      if (distances.distanceLeftLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left;
        result.vertical = nodeBBounds.left;
        verticalDistance = distances.distanceLeftLeft;
      }

      if (distances.distanceRightRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right - nodeABounds.width;
        result.vertical = nodeBBounds.right;
        verticalDistance = distances.distanceRightRight;
      }

      if (distances.distanceLeftRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right;
        result.vertical = nodeBBounds.right;
        verticalDistance = distances.distanceLeftRight;
      }

      if (distances.distanceRightLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left - nodeABounds.width;
        result.vertical = nodeBBounds.left;
        verticalDistance = distances.distanceRightLeft;
      }

      if (distances.distanceTopTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distances.distanceTopTop;
      }

      if (distances.distanceBottomTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top - nodeABounds.height;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distances.distanceBottomTop;
      }

      if (distances.distanceBottomBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distances.distanceBottomBottom;
      }

      if (distances.distanceTopBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distances.distanceTopBottom;
      }

      return result;
    }, defaultResult);
}
